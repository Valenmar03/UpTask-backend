import type { Request, Response } from "express";
import Note, { NoteType } from "../models/Note";

export class NoteController {
    static createNote = async (req: Request<{}, {}, NoteType>, res: Response) => {
        const { content } = req.body
        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send({ status: 'success', payload: note})
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}
