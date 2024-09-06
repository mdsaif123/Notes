import express from 'express';
import { createNote, deleteNote, getAllNotes, updateNote } from '../controller/NotesController.js';
import { requireSignin } from '../middleware/authmiddleware.js';


const router = express.Router();

router.post('/notes', requireSignin, createNote); // Create note
router.get('/notes', getAllNotes); // Get all notes
router.put('/notes/:id',requireSignin, updateNote); // Update note by ID
router.delete('/notes/:id',requireSignin, deleteNote); // Delete note by ID

export default router;
