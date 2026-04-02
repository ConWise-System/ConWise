import express from 'express';
import { taskController } from './task.controller.js';
import { validateBody, createTaskSchema, updateTaskStatusSchema, updateTaskSchema } from './task.validation.js';
import { mountTaskDocs } from './task.api-docs/mountTaskDocs.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = express.Router();

// All task routes are protected
router.use(authenticate);

// Mount the task API docs
mountTaskDocs(router);

// POST /api/tasks — Create a new task
router.post('/tasks', validateBody(createTaskSchema), taskController.createTask);

// GET /api/projects/:projectId/tasks — List tasks for a project
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);

// PATCH /api/tasks/:id/status — Update a task's status
router.patch('/tasks/:id/status', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus);

// PATCH /api/tasks/:id — Update a task
router.patch('/tasks/:id', validateBody(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id — Delete a task
router.delete('/tasks/:id', taskController.deleteTask);

// PATCH /api/tasks/:id/assign/:userId — Assign a task to a user
router.patch('/tasks/:id/assign/:userId', taskController.assignTask);

// PATCH /api/tasks/:id/submit — Submit a task
router.patch('/tasks/:id/submit', taskController.submitTask);

export default router;
