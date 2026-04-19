import prisma from "../../config/prisma.js"


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
        const task = await prisma.task.create({
            data: {
                ...taskData,
                ...(materials?.length
                    ? {
                        materials: {
                            create: materials,
                        },
                    }
                    : {}),
            },
        });
        return withDaysRemaining(task);
    },

    getTasksByProject: async (projectId) => {
        const projectIdInt = Number(projectId);
        const tasks = await prisma.task.findMany({
            where: { projectId: projectIdInt }
        });
        return tasks.map(withDaysRemaining);
    },

    updateTaskStatus: async (id, status) => {
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: { taskStatus: status }
        });
        return withDaysRemaining(task);
    },

    updateTask: async (id, data) => {
        const { materials, ...taskData } = data ?? {};
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                ...taskData,
                ...(materials
                    ? {
                        // Replace materials list if provided.
                        materials: {
                            deleteMany: {},
                            create: materials,
                        },
                    }
                    : {}),
            }
        });
        return withDaysRemaining(task);
    },

    deleteTask: async (id) => {
        return await prisma.task.delete({
            where: { id: Number(id) }
        });
    },

    assignTask: async (taskId, userId) => {
        const task = await prisma.task.update({
            where: { id: Number(taskId) },
            data: { assigneeUserId: Number(userId) }
        });
        return withDaysRemaining(task);
    },

    submitTask: async (taskId) => {
        const task = await prisma.task.update({
            where: { id: Number(taskId) },
            data: { taskStatus: 'SUBMITTED' }
        });
        return withDaysRemaining(task);
    },
};
