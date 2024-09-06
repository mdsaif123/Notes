import express from 'express';
import { requireSignin } from "../middleware/authmiddleware.js";
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controller/eventController.js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Handle file uploads and event creation
router.post('/events', requireSignin, (req, res) => {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(__dirname, '../uploads');
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error handling file upload:', err);
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }

        try {
            const images = files.images
                ? Array.isArray(files.images)
                    ? files.images.map(file => file.filepath)
                    : [files.images.filepath]
                : [];

            // Call the controller and pass fields and images
            const eventData = {
                ...fields,
                images,
                createdBy: req.user._id, // Assuming user is logged in
            };

            // Call the controller function
            createEvent({ body: eventData }, res);

        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ message: 'Error creating event', error });
        }
    });
});



// CRUD Routes for Events
router.get('/', getAllEvents); // Public can view all events
router.get('/:id', getEventById); // Public can view single event
router.put('/:id', requireSignin, updateEvent); // Only authenticated users can update
router.delete('/:id', requireSignin, deleteEvent); // Only authenticated users can delete

export default router;
