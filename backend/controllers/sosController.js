import Location from '../models/locationModel.js';

export const sendLocation = async (req, res) => {
    console.log("Received SOS POST", req.body); // Log the incoming request body
    const { username, latitude, longitude } = req.body;
  
    if (!username || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const location = new Location({ username, latitude, longitude });
      await location.save();
      res.status(201).json({ message: 'Location sent successfully', location });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).json({ error: 'Failed to send location' });
    }
};