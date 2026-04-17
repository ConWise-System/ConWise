import { z } from "zod";

export const createReportSchema = z.object({
  projectId: z.number().int().positive(),
  reportTitle: z.string().min(5).max(200),
  reportType: z.enum([
    "DAILY_SITE_REPORT",
    "PROGRESS_REPORT",
    "INCIDENT_REPORT",
    "QUALITY_REPORT",
  ]),
  reportDate: z.string().datetime(),
  workCompleted: z.string().min(10),
  workersPresent: z.number().int().nonnegative(),
  materialsUsed: z.string().optional(),
  weatherCondition: z.string().optional(),
  challenges: z.string().optional(),
  progressPhotoUrl: z.string().url().optional().nullable(),
});

export const reportIdParamSchema = z.object({
  params: z.object({
    reportId: z.string().regex(/^\d+$/, "Invalid ID").transform(Number),
  }),
});

const managedReportTypeSchema = z.enum([
  REPORT_TYPE.DAILY_SITE_REPORT,
  REPORT_TYPE.PROGRESS_REPORT,
  REPORT_TYPE.INCIDENT_REPORT,
  REPORT_TYPE.QUALITY_REPORT,
]);

export const filerReportByTypeSchema = z.object({
  reportType: managedReportTypeSchema,
});
