import type { Request, Response } from "express"
import bcrypt from 'bcrypt'
import User from "../models/Auth"
import { hashPassword } from "../utils/auth"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const user = new User(req.body)
            user.password = await hashPassword(req.body.password)
            await user.save()
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch(error) {
            res.status(500).send({error: 'Hubo un error'})
        }
    }
}