// src/modules/issue/issue.routes.js
import express from "express";
import { issueController } from "./issue.controller.js";
import {
  validateBody,
  createIssueSchema,
  updateIssueSchema,
  assignIssueSchema,
  updateStatusSchema,
} from "./issue.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true }); // mergeParams: inherit projectId from parent

// All routes require authentication
router.use(authenticate);

// ─── Issue CRUD ───────────────────────────────────────────────────────────────

// POST   /api/projects/:projectId/issues          — Create issue
router.post(
  "/:projectId/issues",
  validateBody(createIssueSchema),
  issueController.createIssue,
);

// GET    /api/projects/:projectId/issues          — List issues (paginated)
router.get("/:projectId/issues", issueController.listIssues);

// get issue for the user working on the task teh issue was created for
// GET /api/projects/issue/assignee
router.get("/issue/assignee", issueController.getIssueByAssignee);

// GET    /api/projects/:projectId/issues/:issueId — Get single issue + audit trail
router.get("/:projectId/issues/:issueId", issueController.getIssue);

// PATCH  /api/projects/:projectId/issues/:issueId — Update metadata
router.patch(
  "/:projectId/issues/:issueId",
  validateBody(updateIssueSchema),
  issueController.updateIssue,
);

// DELETE /api/projects/:projectId/issues/:issueId — Delete (ADMIN only, OPEN only)
router.delete("/:projectId/issues/:issueId", issueController.deleteIssue);

// ─── Issue actions (specific sub-routes AFTER :issueId wildcard) ─────────────

// PATCH  /api/projects/:projectId/issues/:issueId/assign  — Assign to user
router.patch(
  "/:projectId/issues/:issueId/assign",
  validateBody(assignIssueSchema),
  issueController.assignIssue,
);

// PATCH  /api/projects/:projectId/issues/:issueId/status  — Drive state machine
router.patch(
  "/:projectId/issues/:issueId/status",
  validateBody(updateStatusSchema),
  issueController.updateStatus,
);

// GET    /api/projects/:projectId/issues/:issueId/audit   — Audit trail only
router.get("/:projectId/issues/:issueId/audit", issueController.getAuditTrail);

export default router;
