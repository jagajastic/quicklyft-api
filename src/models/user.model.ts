import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    phone: {
      type: String,
      unique: true,
      required: true,
      minlength: 11,
      maxlength: 15,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('user', userModel);
