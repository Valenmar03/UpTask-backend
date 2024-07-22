import type { Request, Response } from "express"
import bcrypt from 'bcrypt'
import User from "../models/Auth"
import { hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import Token from "../models/Token"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {

            const userExists = await User.findOne({email: req.body.email})
            if(userExists){
                const error = new Error('User already exists') 
                return res.status(409).send({error: error.message})
            }

            const user = new User(req.body)

            user.password = await hashPassword(req.body.password)
            
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            await Promise.allSettled([user.save(), token.save()]) // Realiza las dos promesas al mismo tiempo. 
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch(error) {
            res.status(500).send({error: 'Hubo un error'})
        }
    }
}