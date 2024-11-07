import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
   static createTask = async (req: Request, res: Response) => {
      try {
         const task = new Task(req.body);
         task.project = req.project.id;
         req.project.tasks.push(task.id);
         await Promise.allSettled([task.save(), req.project.save()]);
         res.send({ status: "success", data: task });
      } catch (error) {
         res.status(500).send({ status: "error", message: error.message });
      }
   };

   static getTasksByProjectId = async (req: Request, res: Response) => {
      try {
         const tasks = await Task.find({
            project: req.project.id,
         }).populate("project");
         res.json(tasks);
      } catch (error) {
         res.status(500).send({ status: "error", message: error.message });
      }
   };

   static getTasksById = async (req: Request, res: Response) => {
      try {
         const task = await Task.findById(req.task.id)
            .populate({path: 'completedBy.user', select: 'id name email'})
            .populate({path: "notes", populate: {path: 'createdBy', select: 'id name email'}})
            .populate({path: 'project', select: 'id manager'})
         res.json(task);
      } catch (error) {
         res.status(500).send({ status: "error", message: error.message });
      }
   };

   static updateTask = async (req: Request, res: Response) => {
      try {
         const task = req.task;
         task.name = req.body.name;
         task.description = req.body.description;
         await task.save();

         res.json({ status: "success", message: "Task updated successfully" });
      } catch (error) {
         res.status(500).send({ status: "error", message: error.message });
      }
   };

   static deleteTask = async (req: Request, res: Response) => {
      try {
         const { taskId } = req.params;
         const project = req.project;
         const task = req.task;
         project.tasks = project.tasks.filter(
            (task) => task._id.toString() !== taskId
         );
         await Promise.allSettled([task.deleteOne(), project.save()]);

         res.json({ status: "success", message: "Task deleted successfully" });
      } catch (error) {
         res.status(500).send({ status: "error", message: error.message });
      }
   };

   static changeTaskStatus = async (req: Request, res: Response) => {
      try {
         const task = req.task;
         const { status } = req.body;
         task.status = status;
         const data = {
            user: req.user.id,
            status
         }
         req.task.completedBy.push(data)
         await task.save();
         res.json({
            status: "success",
            message: "Status changed successfully",
         });
      } catch (error) {
         res.status(500).send({ status: "error", message: error.message });
      }
   };
}
