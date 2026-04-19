import { z } from 'zod';

const materialInputSchema = z.object({
    materialName: z.string().min(1, "Material name is required"),
    quantityUsed: z.coerce.number().positive("Quantity must be positive"),
    unit: z.string().min(1, "Unit is required"),
    usageDescription: z.string().optional(),
    materialStatus: z.string().min(1, "Material status is required")
});

const taskPrioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW', 'CRITICAL'], {
    errorMap: () => ({ message: "Task priority must be one of: HIGH, MEDIUM, LOW, CRITICAL" })
});

const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'BLOCKED', 'APPROVED', 'REJECTED'], {
    errorMap: () => ({ message: "Task status must be one of: TODO, IN_PROGRESS, SUBMITTED, UNDER_REVIEW, BLOCKED, APPROVED, REJECTED" })
});

const normalizeAssignee = (data) => {
    const assigneeUserId = data.assigneeUserId ?? data.taskAssigneeID ?? undefined;
    // Drop legacy field to match Prisma model field naming.
    // eslint-disable-next-line no-unused-vars
    const { taskAssigneeID, ...rest } = data;
    return { ...rest, assigneeUserId };
};

export const createTaskSchema = z.object({
    projectId: z.coerce.number().int().positive("Project ID must be a positive integer"),
    // Preferred Prisma-aligned field:
    assigneeUserId: z.coerce.number().int().positive().optional(),
    // Legacy alias supported for backwards compatibility:
    taskAssigneeID: z.coerce.number().int().positive().optional(),

    taskTitle: z.string().min(1, "Task title is required"),
    taskDescription: z.string().optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date({ required_error: "Due date is required" }),
    taskBudget: z.coerce.number().nonnegative("Task budget cannot be negative"),
    materials: z.array(materialInputSchema).optional(),
    taskPriority: taskPrioritySchema,
    taskStatus: taskStatusSchema.optional(),
}).transform(normalizeAssignee);

export const updateTaskSchema = z.object({
    projectId: z.coerce.number().int().positive().optional(),
    assigneeUserId: z.coerce.number().int().positive().optional(),
    taskAssigneeID: z.coerce.number().int().positive().optional(),

    taskTitle: z.string().min(1).optional(),
    taskDescription: z.string().optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    taskBudget: z.coerce.number().nonnegative().optional(),
    materials: z.array(materialInputSchema).optional(),
    taskPriority: taskPrioritySchema.optional(),
    taskStatus: taskStatusSchema.optional(),
}).transform(normalizeAssignee);

export const updateTaskStatusSchema = z.object({
    taskStatus: taskStatusSchema
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
