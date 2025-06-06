import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

locationSchema.index({ username: 1 });
locationSchema.index({ timestamp: -1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;
