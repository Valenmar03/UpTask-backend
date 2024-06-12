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
            }).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    static getTasksById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId).populate('project')
            if(!task){
                const error = new Error('Task not found')
                return res.status(404).send({status: 'error', message: error.message})
            }
            if(task.project.id !== req.project.id){
                const error = new Error('Bad Request')
                return res.status(400).send({status: 'error', message: error.message})
            }
            res.json(task)
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }
}