import express from 'express';
import { sendLocation, getAllLocations } from '../controllers/sosController.js';

const router = express.Router();

router.post('/send', sendLocation);
router.get('/all', getAllLocations);

export default router;
