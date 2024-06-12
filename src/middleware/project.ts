import type { Request, Response, NextFunction } from "express";
import Project, { ProjectType } from "../models/Project";

declare global {
    namespace Express {
        interface Request {
            project: ProjectType
        }
    }
}


export async function projectExists( req: Request, res: Response, next: NextFunction){
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if(!project){
            const error = new Error(`Project not found`)
            return res.status(404).json({status: 'error', error: error.message})
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', error: ''})
    }
} 