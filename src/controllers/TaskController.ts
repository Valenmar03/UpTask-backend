import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send({status: 'success', data: task})      
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    static getTasksByProjectId = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({
                project: req.project.id
            })
            res.json(tasks)
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }
}