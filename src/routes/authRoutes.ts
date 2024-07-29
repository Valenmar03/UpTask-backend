import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Account name is required'),
    body('email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .isLength({min: 8}).withMessage('The Password is to short, must have at least 8 characters'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('The passwords do not match')
            }
            return true
        }),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.logIn
)

router.post('/request-new-code',
    body('email')
        .notEmpty().withMessage('Email is required'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

export default router