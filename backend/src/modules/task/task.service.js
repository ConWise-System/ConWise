// src/modules/task/task.service.js
import prisma from "../../config/prisma.js";
import * as notificationService from "../notification/notification.service.js";

const calculateDaysRemaining = (dueDate) => {
  if (!dueDate) return 0;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const withDaysRemaining = (task) => ({
  ...task,
  daysRemaining: calculateDaysRemaining(task?.dueDate),
});

export const taskService = {
  createTask: async (data) => {
    // Strip fields that don't exist on the Task model.
    // `materials` is NOT a Task relation — material linking uses materialUsedId (FK to existing record).
    const {
      materials, // not a Task field, ignore
      taskAssigneeID, // old field name, map to assigneeUserId
      projectId,
      assigneeUserId,
      taskTitle,
      taskDescription,
      startDate,
      dueDate,
      taskBudget,
      taskPriority,
      taskStatus,
      materialUsedId,
    } = data ?? {};

    const resolvedAssigneeId = parseInt(assigneeUserId ?? taskAssigneeID);
    const resolvedProjectId = parseInt(projectId);

    if (isNaN(resolvedProjectId) || resolvedProjectId < 1) {
      const err = new Error("projectId must be a positive integer");
      err.statusCode = 400;
      throw err;
    }
    if (isNaN(resolvedAssigneeId) || resolvedAssigneeId < 1) {
      const err = new Error("assigneeUserId must be a positive integer");
      err.statusCode = 400;
      throw err;
    }

    const project = await prisma.project.findUnique({
      where: { id: resolvedProjectId },
    });
    if (!project) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }

    const task = await prisma.task.create({
      data: {
        projectId: resolvedProjectId,
        assigneeUserId: resolvedAssigneeId,
        taskTitle,
        taskDescription: taskDescription ?? null,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: new Date(dueDate),
        taskBudget,
        taskPriority,
        taskStatus: taskStatus ?? "TODO",
        materialUsedId: materialUsedId ? parseInt(materialUsedId) : null,
      },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        project: { select: { id: true, projectName: true } },
      },
    });

    // Notify the Site Engineer
    try {
      await notificationService.createNotification({
        recipientUserId: task.assigneeUserId,
        notificationTitle: "New Task Assigned",
        notificationDescription: `You have been assigned to: ${task.taskTitle} in project ${task.project.projectName}`,
        relatedEntityType: "TASK",
        relatedEntityId: task.id,
      });
    } catch (err) {
      console.error("Notification failed in task service", err.message);
    }

    return withDaysRemaining(task);
  },

  getTasksByProject: async (projectId) => {
    const id = parseInt(projectId);
    if (isNaN(id) || id < 1) {
      const err = new Error("projectId must be a positive integer");
      err.statusCode = 400;
      throw err;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
        taskProgress: true,
        materialUsed: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return tasks.map(withDaysRemaining);
  },

  updateTaskStatus: async (id, status) => {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { taskStatus: status },
    });
    return withDaysRemaining(task);
  },

  updateTask: async (id, data) => {
    const {
      materials, // ignore — not a Task relation
      taskAssigneeID, // old field name
      projectId, // not updatable after creation
      ...rest
    } = data ?? {};

    const allowedFields = [
      "taskTitle",
      "taskDescription",
      "startDate",
      "dueDate",
      "taskBudget",
      "taskPriority",
      "taskStatus",
      "assigneeUserId",
      "materialUsedId",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (rest[field] !== undefined) updateData[field] = rest[field];
    }

    if (taskAssigneeID && !updateData.assigneeUserId) {
      updateData.assigneeUserId = parseInt(taskAssigneeID);
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        project: { select: { projectName: true, projectManagerId: true } },
        assignee: { select: { id: true } },
      },
    });

    try {
      // 1. If Engineer marks as PENDING_APPROVAL -> Notify PM
      if (status === "PENDING_APPROVAL") {
        await notificationService.createNotification({
          recipientUserId: task.project.projectManagerId,
          notificationTitle: "Task Ready for Review",
          notificationDescription: `Task "${task.taskTitle}" has been submitted for approval in ${task.project.projectName}.`,
          relatedEntityType: "TASK",
          relatedEntityId: task.id,
        });
      }
      // 2. If PM marks as DONE (Approved) or REVISION -> Notify Engineer
      else if (status === "DONE" || status === "IN_PROGRESS") {
        await notificationService.createNotification({
          recipientUserId: task.assigneeUserId,
          notificationTitle:
            status === "DONE" ? "Task Approved" : "Task Needs Revision",
          notificationDescription: `Your task "${task.taskTitle}" was marked as ${status.toLowerCase().replace("_", " ")}.`,
          relatedEntityType: "TASK",
          relatedEntityId: task.id,
        });
      }
    } catch (err) {
      console.error("Notification failed in task service:", err.message);
    }

    return withDaysRemaining(task);
  },

  deleteTask: async (id) => {
    return prisma.task.delete({ where: { id: parseInt(id) } });
  },

  assignTask: async (taskId, userId) => {
    console.log(`Assigning task ${taskId} to user ${userId} in service layer`);
    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { assigneeUserId: parseInt(userId) },
    });

    try {
      await notificationService.createNotification({
        recipientUserId: task.assigneeUserId,
        notificationTitle: "New Task Assignment",
        notificationDescription: `You have been assigned to: ${task.taskTitle}`,
        relatedEntityType: "TASK",
        relatedEntityId: task.id,
      });
    } catch (err) {
      console.error("Notification failed in task service:", err.message);
    }

    return withDaysRemaining(task);
  },

  submitTask: async (taskId) => {
    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { taskStatus: "DONE" },
    });

    try {
      await notificationService.createNotification({
        recipientUserId: task.project.projectManagerId,
        notificationTitle: "Task Submitted",
        notificationDescription: `A task in ${task.project.projectName} is waiting for your review.`,
        relatedEntityType: "TASK",
        relatedEntityId: task.id,
      });
    } catch (err) {
      console.error("Notification failed in task service:", err.message);
    }

    return withDaysRemaining(task);
  },
};
