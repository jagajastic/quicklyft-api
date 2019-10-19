import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const codeSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      maxlength: 8,
    },
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

export default mongoose.model('code', codeSchema);
