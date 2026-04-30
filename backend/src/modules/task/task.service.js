// src/modules/task/task.service.js
import prisma from "../../config/prisma.js";

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
        const task = await prisma.task.create({
            data: {
                ...taskData,
                ...(materialIds.length
                    ? {
                        materials: {
                            connect: materialIds.map((id) => ({ id })),
                        },
                    }
                    : {}),
            },
        });
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
        const { materials, ...taskData } = data ?? {};
        const materialIds = materials?.length
            ? [...new Set(materials.map((materialId) => Number(materialId)))]
            : [];
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                ...taskData,
                ...(materials
                    ? {
                        // Replace the task-material assignment list.
                        materials: {
                            set: materialIds.map((materialId) => ({ id: materialId })),
                        },
                    }
                    : {}),
            }
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
    return withDaysRemaining(task);
  },

  submitTask: async (taskId) => {
    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { taskStatus: "DONE" },
    });
    return withDaysRemaining(task);
  },
};
