import { Schema, model, Document, models } from 'mongoose';

// Define the interface for Socials
interface ISocials extends Document {
  userId: string; // userId is now a string
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

// Define the Socials schema
const socialsSchema = new Schema<ISocials>(
  {
    userId: { type: String, required: true }, // userId as a string
    facebook: { type: String, required: false },
    linkedin: { type: String, required: false },
    instagram: { type: String, required: false },
    twitter: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

// Create and export the model
export const Socials = models.Socials || model<ISocials>('Socials', socialsSchema);
