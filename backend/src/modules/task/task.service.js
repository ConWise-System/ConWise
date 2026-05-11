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
    const { materials, ...taskData } = data ?? {};
    const materialIds = materials?.length
      ? [...new Set(materials.map((id) => Number(id)))]
      : [];

    const task = await prisma.$transaction(async (tx) => {
      const createdTask = await tx.task.create({
        data: {
          ...taskData,
        },
        include: {
          project: {
            select: {
              projectName: true,
            },
          },
        },
      });

      if (materialIds.length) {
        const updated = await tx.materialUsed.updateMany({
          where: { id: { in: materialIds } },
          data: { taskId: createdTask.id },
        });

        if (updated.count !== materialIds.length) {
          throw new Error("One or more material IDs were not found.");
        }
      }

      return createdTask;
    });

    // sendnotification to site engineer
    try {
      await notificationService.createNotification({
        recipientUserId: task.assigneeUserId,
        notificationTitle: "New Task Assigned",
        notificationDescription: `You have been assigned to: ${task.taskTitle} in project ${task.project?.projectName}`,
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
        materials: {
          select: {
            id: true,
            materialName: true,
            quantityUsed: true,
            unit: true,
            usageDescription: true,
            materialStatus: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return tasks.map(withDaysRemaining);
  },

  getTasksByAssignee: async (userId) => {
    const tasks = await prisma.task.findMany({
      where: { assigneeUserId: parseInt(userId) },
      include: {
        project: { select: { id: true, projectName: true, status: true } },
        taskProgress: true,
        assignee: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return tasks.map(withDaysRemaining);
  },

  updateTaskStatus: async (id, status) => {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { taskStatus: status },
    });

    // send notification
    try {
      await notificationService.createNotification({
        recipientUserId: task.assigneeUserId,
        notificationTitle: "Task Status Updated",
        notificationDescription: `The status of your task "${task.taskTitle}" has been updated to "${status}".`,
        relatedEntityType: "TASK",
        relatedEntityId: task.id,
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
    return withDaysRemaining(task);
  },

  updateTask: async (id, data) => {
    const { materials, ...taskData } = data ?? {};
    const taskId = Number(id);
    const materialIds = materials?.length
      ? [...new Set(materials.map((materialId) => Number(materialId)))]
      : [];

    const task = await prisma.$transaction(async (tx) => {
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          ...taskData,
        },
      });

      if (materials) {
        if (materialIds.length) {
          const updated = await tx.materialUsed.updateMany({
            where: { id: { in: materialIds } },
            data: { taskId },
          });

          if (updated.count !== materialIds.length) {
            throw new Error("One or more material IDs were not found.");
          }
        }
      }

      return updatedTask;
    });
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
      include: {
        project: {
          select: {
            projectName: true,
            ownerUserId: true,
          },
        },
      },
    });

    try {
      await notificationService.createNotification({
        recipientUserId: task.project.ownerUserId,
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
