import type { Response, Request } from "express"
import User from "../models/Auth"
import Project from "../models/Project"

export class TeamMemberController {

    static getTeamMembers = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })
        res.send({status: 'success', payload: project.team})
    }

    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        const user = await User.findOne({ email }).select(' id email name')
        if(!user){
            return res.status(404).send({error: "User not found"})
        }
        res.send(user)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body

        const user = await User.findById(id).select('id')
        if(!user){
            const error = new Error("User not found")
            return res.status(404).send({error: error.message})
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())){
            const error = new Error("User already is a member of team")
            return res.status(409).send({error: error.message})
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.send({status: 'success', message: 'User added successfully'})
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { id } = req.body

        if(!req.project.team.some(team => team.toString() === id)){
            const error = new Error("The User is not a member of team")
            return res.status(409).send({error: error.message})
        }

        req.project.team = req.project.team.filter( member => member.toString() !== id)
        await req.project.save()
        res.send({status: 'success', message: 'User removed successfully'})
    }

}