import { ProfessionalDetailType } from "@/sections/dashboard/formSchemas";
import mongoose, { Document, Schema, Model } from "mongoose";

// Define Mongoose interface for ProfessionalDetails
export interface DbProfessionalDetailType extends Document, ProfessionalDetailType {
  email: string;
}

// Define the schema
const professionalDetailsSchema = new Schema<DbProfessionalDetailType>(
  {
    email: { type: String, required: true, unique: true, trim: true }, // Ensure email is part of the schema
    experience: { type: String },
    specialization: { type: String },
    bio: { type: String },
    address: { type: String },
    agency: { type: String },
    license: { type: String },
  },
  { timestamps: false, versionKey: false }
);

// Ensure unique index on email

// Define and export the model
const ProfessionalDetail: Model<DbProfessionalDetailType> =
  mongoose.models.ProfessionalDetail ||
  mongoose.model<DbProfessionalDetailType>(
    "ProfessionalDetail",
    professionalDetailsSchema
  );

export default ProfessionalDetail;
