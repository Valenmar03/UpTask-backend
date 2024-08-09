import colors from 'colors'
import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body);  
        project.manager = req.user.id   
        try {
            await project.save()
            res.send({status: 'success', message: 'Project created succesfully'})
        } catch (error) {
            console.log(colors.red('Error creating project...'))
            res.status(500).send({status: 'error', message: 'Error creating project'})
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {
                        manager: { $in: req.user.id}
                    }
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(colors.red('Error finding all projects...'))
            res.status(500).send({status: 'error', message: error.message})
        }

    }
    
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project =  await Project.findById(id).populate('tasks')
            if(!project) {
                const error = new Error(`Project not found`)
                return res.status(404).json({status: 'error', error: error.message})
            }
            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error(`Unauthorized`)
                return res.status(401).json({status: 'error', error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(colors.red('Error finding a project by Id...'))            
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error(`Project not found`)
                return res.status(404).json({status: 'error', error: error.message})
            }
            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error(`Unauthorized`)
                return res.status(401).json({status: 'error', error: error.message})
            }
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description
            await project.save()
            res.send({status: 'success', message: 'Product updated successfully'})
        } catch (error) {
            console.log(colors.red(error))
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error(`Project not found`)
                return res.status(404).send({status: 'error', error: error.message})
            }
            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error(`Unauthorized`)
                return res.status(401).json({status: 'error', error: error.message})
            }
            await project.deleteOne()
            res.send({status: 'success', message: 'Project deleted successfully'})
        } catch (error) {
            console.log(colors.red('Error deleting project...'))
            res.status(500).send({status: 'error', message: error.message})
        }
    }
}