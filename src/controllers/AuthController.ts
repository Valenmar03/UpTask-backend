import type { Request, Response } from "express"
import User from "../models/Auth"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import Token from "../models/Token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"


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

            AuthEmail.confirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            

            await Promise.allSettled([user.save(), token.save()]) // Realiza las dos promesas al mismo tiempo. 
            res.send('Account created successfully, check email to confirm')
        } catch(error) {
            res.status(500).send({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const token = req.body
            const tokenExists = await Token.findOne(token) // Recibe un objeto
            
            if(!tokenExists){
                const error = new Error('Invalid Token') 
                return res.status(404).send({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true
            
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            
            res.send('Account confirmed')
        } catch (error) {
            res.status(500).send({error: error.message})
        }
    }

    static logIn = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({email: email})
            if(!user){
                const error = new Error('User not found') 
                return res.status(404).send({error: error.message})
            }
            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()

                await token.save()

                AuthEmail.confirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                
                const error = new Error('User is not confirmed, check your email to confirm the account') 
                return res.status(401).send({error: error.message})
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Password is not correct') 
                return res.status(401).send({error: error.message})
            }

            const token = generateJWT({id: user.id})

            res.send(token)
        } catch (error) {
            res.status(500).send({error: error.message})
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {

            const user = await User.findOne({email: req.body.email})
            if(!user){
                const error = new Error("User doesn't exist") 
                return res.status(404).send({error: error.message})
            }
            if(user.confirmed){
                const error = new Error('User is already confirmed') 
                return res.status(403).send({error: error.message})
            }
        
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.confirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            

            await token.save()
            res.send('A new confirmation code was sent, check email to confirm')
        } catch(error) {
            res.status(500).send({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {

            const user = await User.findOne({email: req.body.email})
            if(!user){
                const error = new Error("User doesn't exist") 
                return res.status(404).send({error: error.message})
            }
        
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.forgotPasswordEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save()
            res.send('Check email and follow instructions to restore password. Can close this page')
        } catch(error) {
            res.status(500).send({error: 'Hubo un error'})
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const token = req.body
            const tokenExists = await Token.findOne(token)
            if(!tokenExists){
                const error = new Error('Invalid Token') 
                return res.status(404).send({error: error.message})
            }
            res.send('Valid token, define your new password')
        } catch (error) {
            res.status(500).send({error: error.message})
        }
    }

    static updatePassword = async (req: Request, res: Response) => {
        try {
            const token = req.params
            const tokenExists = await Token.findOne(token)
            if(!tokenExists){
                const error = new Error('Invalid Token') 
                return res.status(404).send({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Password succesfully updated. Reditecting...')
        } catch (error) {
            res.status(500).send({error: error.message})
        }
    }
}