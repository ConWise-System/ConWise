import { taskService } from './task.service.js';

export const taskController = {
    createTask: async (req, res) => {
        console.log("REQUEST RECEIVED");
        try {
            const task = await taskService.createTask(req.body);
            return res.status(201).json({ success: true, data: task });
        } catch (error) {
            console.error("Error in createTask:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    getTasksByProject: async (req, res) => {
        try {
            const { projectId } = req.params;
            const tasks = await taskService.getTasksByProject(projectId);
            return res.status(200).json({ success: true, data: tasks });
        } catch (error) {
            console.error("Error in getTasksByProject:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    updateTaskStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { taskStatus } = req.body;
            const task = await taskService.updateTaskStatus(id, taskStatus);
            return res.status(200).json({ success: true, data: task });
        } catch (error) {
            console.error("Error in updateTaskStatus:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    updateTask: async (req, res) => {
        try {
            const { id } = req.params;
            const task = await taskService.updateTask(id, req.body);
            return res.status(200).json({ success: true, data: task });
        } catch (error) {
            console.error("Error in updateTask:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;
            await taskService.deleteTask(id);
            return res.status(200).json({ success: true, message: "Task deleted successfully" });
        } catch (error) {
            console.error("Error in deleteTask:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    assignTask: async (req, res) => {
        try {
            const { id, userId } = req.params;
            const task = await taskService.assignTask(id, userId);
            return res.status(200).json({ success: true, data: task });
        } catch (error) {
            console.error("Error in assignTask:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    submitTask: async (req, res) => {
        try {
            const { id } = req.params;
            const task = await taskService.submitTask(id);
            return res.status(200).json({ success: true, data: task });
        } catch (error) {
            console.error("Error in submitTask:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};
