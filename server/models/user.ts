import mongoose, { Document, Schema, Model } from 'mongoose';

export interface DbUserType extends Document {
  username: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
  password: string;
  image: string
}

const userSchema = new Schema<DbUserType>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    phone: {
      type: String,
      default: '+234123456789',
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    }
  },
  { timestamps: false, versionKey: false }
);

// Ensure unique index is created
userSchema.index({ email: 1, username: 1 }, { unique: true });

// Safely define the User model
const User: Model<DbUserType> = mongoose.models.User || mongoose.model<DbUserType>('User', userSchema);

export default User;
