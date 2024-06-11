import colors from 'colors'

import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)

        try {
            await project.save()
            res.send({status: 'success', message: 'Project created succesfully'})
        } catch (error) {
            console.log(colors.red('Error creating project...'))
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(colors.red('Error finding all projects...'))
            console.log(error)
        }

    }
    
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error(`Project not found`)
                return res.status(404).json({status: 'error', error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(colors.red('Error finding a project by Id...'))
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)
            if(!project) {
                const error = new Error(`Project not found`)
                return res.status(404).json({status: 'error', error: error.message})
            }
            await project.save()
            res.send({status: 'success', message: 'Product updated successfully'})
        } catch (error) {
            console.log(colors.red('Error updating a project...'))
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error(`Project not found`)
                return res.status(404).json({status: 'error', error: error.message})
            }
            await project.deleteOne()
            res.send({status: 'success', message: 'Product deleted successfully'})
        } catch (error) {
            console.log(colors.red('Error deleting project...'))
            console.log(error)
        }
    }
}