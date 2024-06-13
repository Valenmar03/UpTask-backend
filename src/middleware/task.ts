import type { Request, Response, NextFunction } from "express";
import Task, { TaskType } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: TaskType
        }
    }
}


export async function taskExists( req: Request, res: Response, next: NextFunction){
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
           const error = new Error("Task not found");
           return res
              .status(404)
              .send({ status: "error", message: error.message });
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', error: ''})
    }
}