import { transport } from "../config/nodemailer"

type EmailType = {
    email: string;
    name: string;
    token: string;
}


export class AuthEmail {
    static confirmationEmail = async (user : EmailType) => {
        const info = await transport.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu Cuenta',
            text: 'UpTask - Confirma tu Cuenta',
            html: `<h2>¡Hola ${user.name}!</h2>
                <p>Visita el siguiente enlace: </p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta.</a>
                <p>E ingresa el código: <strong>${user.token}</strong></p>
                <p>El código expirará en 10 minutos</p>
            `
        })

    }

    static forgotPasswordEmail = async (user : EmailType) => {
        const info = await transport.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Reestablecer Contraseña',
            text: 'UpTask - Reestablecer Contraseña',
            html: `<h2>¡Hola ${user.name}!</h2>
                <p>Visita el siguiente enlace: </p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablece tu Contraseña.</a>
                <p>E ingresa el código: <strong>${user.token}</strong></p>
                <p>El código expirará en 10 minutos</p>
            `
        })

        console.log('Mensaje enviado', info.messageId)
    }
}

