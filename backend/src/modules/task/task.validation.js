import { z } from 'zod';

export const createTaskSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    taskAssigneeID: z.string().min(1, "Assignee ID is required"),
    taskTitle: z.string().min(1, "Task title is required"),
    taskDescription: z.string().optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    taskBudget: z.number().nonnegative("Task budget cannot be negative").optional(),
    materialUsed: z.string().optional(),
    taskPriority: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
        errorMap: () => ({ message: "Task priority must be one of: HIGH, MEDIUM, LOW" })
    }),
    taskStatus: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
        errorMap: () => ({ message: "Task status must be one of: TODO, IN_PROGRESS, DONE" })
    })
});

export const updateTaskStatusSchema = z.object({
    taskStatus: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
        errorMap: () => ({ message: "Task status must be one of: TODO, IN_PROGRESS, DONE" })
    })
});

export const validateBody = (schema) => (req, res, next) => {
    try {
        const validatedData = schema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, error: error.errors });
    }
};
