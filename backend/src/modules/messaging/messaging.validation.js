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

export const getChatHistorySchema = z.object({
  query: z
    .object({
      projectId: z.string().regex(/^\d+$/).transform(Number).optional(),
      receiverUserId: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
    .refine((data) => data.projectId || data.receiverUserId, {
      message: "Either projectId or receiverUserId is required",
    }),
});
