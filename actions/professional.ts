"use server"

import { ProfessionalDetailType } from "@/sections/dashboard/formSchemas";
import { auth } from "@/auth";
import { errorMessage } from "@/constants";
import ProfessionalDetail from "@/server/models/ProfessionalDetails";
import dbInit from "@/server/db";


export async function updateProfessionalDetail(data: Partial<ProfessionalDetailType>) {
  try {
    await dbInit()
    const user = await auth().then(res => res?.user)
    const updatedProfessional = await ProfessionalDetail.findOneAndUpdate(
      { email: user.email }, // Find by email
      { $set: data }, // Update fields
      { new: true, upsert: true } // Create if not exists
    ).select("-email -_id -__v");

    return ({
        success: true,
        message: null,
        data: updatedProfessional
    });
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export async function getProfessionalDetail() {
  
    try {
      await dbInit()
      const user = await auth().then(res => res?.user)
      const professional = await ProfessionalDetail.findOne({ email:  user.email }).select("-email -_id -__v");
      return ({
        success: true,
        message: null,
        data: professional
    });;
    } catch (err: any) {
        return errorMessage(err.message);
    }
  }