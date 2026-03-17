import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
};

export const taskService = {
    createTask: async (data) => {
        const task = await prisma.task.create({ data });
        return {
            ...task,
            daysRemaining: calculateDaysRemaining(task.dueDate)
        };
    },

    getTasksByProject: async (projectId) => {
        const tasks = await prisma.task.findMany({
            where: { projectId }
        });
        return tasks.map(task => ({
            ...task,
            daysRemaining: calculateDaysRemaining(task.dueDate)
        }));
    },

    updateTaskStatus: async (id, status) => {
        const task = await prisma.task.update({
            where: { id },
            data: { taskStatus: status }
        });
        return {
            ...task,
            daysRemaining: calculateDaysRemaining(task.dueDate)
        };
    },

    deleteTask: async (id) => {
        throw new Error('Not implemented');
    },

    assignTask: async (taskId, userId) => {
        throw new Error('Not implemented');
    },

    submitTask: async (taskId) => {
        throw new Error('Not implemented');
    },

    approveTaskSubmission: async (taskId) => {
        throw new Error('Not implemented');
    },

    reviewSubmittedTask: async (taskId) => {
        throw new Error('Not implemented');
    },

    rejectSubmittedTask: async (taskId) => {
        throw new Error('Not implemented');
    }
};
