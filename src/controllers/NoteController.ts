import type { Request, Response } from "express";
import Note, { NoteType } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId
}

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
    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id})
            res.send({ status: 'success', payload: notes})
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params 
        const note = await Note.findById(noteId)
        if(!note){
            const error = new Error('Note not found')
            return res.status(404).send({ error: error.message})
        }

        if(note.createdBy.toString() !== req.user.id.toString() && req.project.manager.toString() !== req.user.id.toString()){
            const error = new Error('Invalid action')
            return res.status(404).send({ error: error.message})
        }

        try {
            await note.deleteOne()
            res.send({ status: 'success', message: 'Note deleted successfully'})

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}
