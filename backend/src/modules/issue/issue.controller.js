// src/modules/issue/issue.controller.js
import { issueService } from "./issue.service.js";

// ─── Shared error handler (matches project/material controller pattern) ───────
const handleError = (res, error, context) => {
  if (error.statusCode === 403) {
    return res.status(403).json({ success: false, message: error.message });
  }
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }
  if (error.statusCode === 409) {
    return res.status(409).json({ success: false, message: error.message });
  }
  if (error.statusCode === 400) {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error(`Error in ${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
};

// ─── Parse positive integer helper ───────────────────────────────────────────
const parsePositiveInt = (value, fieldName) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    const err = new Error(`${fieldName} must be a positive integer`);
    err.statusCode = 400;
    throw err;
  }
  return n;
};

export const issueController = {
  /**
   * @swagger
   * /api/projects/{projectId}/issues:
   *   post:
   *     summary: Create a new site issue
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, description]
   *             properties:
   *               title:       { type: string, example: "Cracked foundation beam" }
   *               description: { type: string, example: "20cm crack found on south wall beam" }
   *               priority:    { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL], default: MEDIUM }
   *               location:    { type: string, example: "Block C, Floor 2" }
   *               photoUrls:   { type: array, items: { type: string } }
   *               blockedTaskId: { type: integer }
   */
  createIssue: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId, "projectId");
      const issue = await issueService.createIssue({
        projectId,
        reporterId: req.user.id,
        companyId: req.user.companyId,
        userRole: req.user.role,
        data: req.body,
      });
      return res.status(201).json({ success: true, data: issue });
    } catch (error) {
      return handleError(res, error, "createIssue");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues:
   *   get:
   *     summary: List all issues for a project (paginated, filterable)
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema: { type: integer }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED] }
   *       - in: query
   *         name: priority
   *         schema: { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL] }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20 }
   */
  listIssues: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId, "projectId");
      const result = await issueService.listIssues({
        projectId,
        companyId: req.user.companyId,
        userRole: req.user.role,
        userId: req.user.id,
        query: req.query,
      });
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return handleError(res, error, "listIssues");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues/{issueId}:
   *   get:
   *     summary: Get a single issue with full audit trail
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   */
  getIssue: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId, "projectId");
      const issueId = parsePositiveInt(req.params.issueId, "issueId");
      const issue = await issueService.getIssue({
        issueId,
        projectId,
        companyId: req.user.companyId,
        userRole: req.user.role,
        userId: req.user.id,
      });
      return res.status(200).json({ success: true, data: issue });
    } catch (error) {
      return handleError(res, error, "getIssue");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues/{issueId}:
   *   patch:
   *     summary: Update issue metadata (title, description, location, photos, priority)
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   */
  updateIssue: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId, "projectId");
      const issueId = parsePositiveInt(req.params.issueId, "issueId");
      const updated = await issueService.updateIssue({
        issueId,
        projectId,
        companyId: req.user.companyId,
        actorId: req.user.id,
        userRole: req.user.role,
        data: req.body,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return handleError(res, error, "updateIssue");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues/{issueId}/assign:
   *   patch:
   *     summary: Assign an issue to a staff member
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [assigneeId]
   *             properties:
   *               assigneeId: { type: integer }
   *               note:       { type: string }
   */
  assignIssue: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId, "projectId");
      const issueId = parsePositiveInt(req.params.issueId, "issueId");
      const assigneeId = parsePositiveInt(req.body.assigneeId, "assigneeId");
      const result = await issueService.assignIssue({
        issueId,
        projectId,
        companyId: req.user.companyId,
        actorId: req.user.id,
        userRole: req.user.role,
        assigneeId,
        note: req.body.note,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return handleError(res, error, "assignIssue");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues/{issueId}/status:
   *   patch:
   *     summary: Update issue status (state machine enforced)
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [status]
   *             properties:
   *               status: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED] }
   *               note:   { type: string }
   */
  updateStatus: async (req, res) => {
    try {
      const issueId = parsePositiveInt(req.params.issueId, "issueId");
      const updated = await issueService.updateStatus({
        issueId,
        companyId: req.user.companyId,
        actorId: req.user.id,
        userRole: req.user.role,
        newStatus: req.body.status,
        note: req.body.note,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return handleError(res, error, "updateStatus");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues/{issueId}/audit:
   *   get:
   *     summary: Get full audit trail for an issue
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   */
  getAuditTrail: async (req, res) => {
    try {
      const issueId = parsePositiveInt(req.params.issueId, "issueId");
      const logs = await issueService.getAuditTrail({
        issueId,
        companyId: req.user.companyId,
        userRole: req.user.role,
        userId: req.user.id,
      });
      return res.status(200).json({ success: true, data: logs });
    } catch (error) {
      return handleError(res, error, "getAuditTrail");
    }
  },

  /**
   * @swagger
   * /api/projects/{projectId}/issues/{issueId}:
   *   delete:
   *     summary: Delete an issue (ADMIN only, OPEN status only)
   *     tags: [Issues]
   *     security:
   *       - bearerAuth: []
   */
  deleteIssue: async (req, res) => {
    try {
      const issueId = parsePositiveInt(req.params.issueId, "issueId");
      const result = await issueService.deleteIssue({
        issueId,
        companyId: req.user.companyId,
        userRole: req.user.role,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return handleError(res, error, "deleteIssue");
    }
  },

  getIssuesByAssignee: async (req, res) => {
    try {
      const issues = await issueService.getIssuesByAssignee({
        userId: req.user.id,
        companyId: req.user.companyId,
      });
      return res.status(200).json({ success: true, data: issues });
    } catch (error) {
      return handleError(res, error, "getIssuesByAssignee");
    }
  },
};
