import colors from 'colors'

import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)

        try {
            await project.save()
            res.send('Project created succesfully')
        } catch (error) {
            console.log(colors.red('Error creating project...'))
            console.log(error)
            res.status(400).send({error: 'Error creating project', message: error.message})
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        res.send('Todos los proyectos')
    }
}