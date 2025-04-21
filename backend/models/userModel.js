import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  contactNumber: String,
});

const User = mongoose.model('User', userSchema);

export default User;