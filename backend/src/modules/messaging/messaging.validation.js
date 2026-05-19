import { z } from "zod";

export const sendMessageSchema = z
  .object({
    messageContent: z.string().min(1).max(2000),
    chatType: z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]).default("TEXT"),
    projectId: z.number().int().positive().optional(),
    receiverUserId: z.number().int().positive().optional(),
  })
  .refine((data) => data.projectId || data.receiverUserId, {
    message: "Either projectId or receiverUserId must be provided",
  });

export const getPrivateChatHistorySchema = z.object({
  receiverUserId: z
    .string()
    .regex(/^\d+$/, { message: "receiverUserId must be a valid numeric string" })
    .transform(Number), // Transforms "4" into 4 and saves it back to req.query
});