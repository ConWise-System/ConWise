import express from 'express';
import { taskController } from './task.controller.js';
import { validateBody, createTaskSchema, updateTaskStatusSchema } from './task.validation.js';

const router = express.Router();

router.post('/tasks', validateBody(createTaskSchema), taskController.createTask);
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);
router.patch('/tasks/:id', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus);

export default router;
