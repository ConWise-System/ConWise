import express from 'express';
import { taskController } from './task.controller.js';
import { validateBody, createTaskSchema, updateTaskStatusSchema, updateTaskSchema } from './task.validation.js';
import authenticate from '../../middlewares/auth.middleware.js';

const router = express.Router();

// All task routes are protected
router.use(authenticate);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     description: |
 *       Creates a task under a project.
 *       Runtime note: passing `materials` currently fails until the database has the `materials_used.taskId` column.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/tasks', validateBody(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks for a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task's status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskStatusInput'
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.patch('/tasks/:id/status', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.patch('/tasks/:id', validateBody(updateTaskSchema), taskController.updateTask);

router.delete('/tasks/:id', taskController.deleteTask);

/**
 * @swagger
 * /api/tasks/{id}/assign/{userId}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Assign a task to a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       500:
 *         description: Internal server error
 */
router.patch('/tasks/:id/assign/:userId', taskController.assignTask);

/**
 * @swagger
 * /api/tasks/{id}/submit:
 *   patch:
 *     tags: [Tasks]
 *     summary: Submit a task (sets status to SUBMITTED)
 *     description: |
 *       Sets task status to `SUBMITTED`.
 *       Runtime note: this endpoint currently returns 500 if the database enum `TaskStatus` does not include `SUBMITTED`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       500:
 *         description: Internal server error
 */
router.patch('/tasks/:id/submit', taskController.submitTask);

export default router;
