import Location from '../models/locationModel.js';

export const sendLocation = async (req, res) => {
  const { username, latitude, longitude } = req.body;

  if (!username || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid or missing fields' });
  }

  try {
    const location = new Location({ username, latitude, longitude });
    await location.save();

    return res.status(201).json({
      success: true,
      message: 'Location sent successfully',
      data: location,
    });
  } catch (error) {
    console.error("Location Save Error:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send location',
      error: error.message,
    });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
  }
};
