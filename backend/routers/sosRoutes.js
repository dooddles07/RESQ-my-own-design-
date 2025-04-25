import express from 'express';
import { sendLocation } from '../controllers/sosController.js';

const router = express.Router();

router.post('/send', sendLocation);

export default router;