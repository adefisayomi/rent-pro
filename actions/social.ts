"use server"

import dbInit from "@/server/db";



import { auth } from "@/auth";
import { errorMessage } from "@/constants";
import { Socials } from "@/server/models/social";

export async function updateSocial (data: any) {
    try {
      await dbInit()
        const user = await auth().then((res) => res?.user);
        if (!user) throw new Error("unauthorized request");
        // 
        let socials = await Socials.findOne({ userId: user.id });

        if (socials) {
          // If found, update the existing document
          socials = await Socials.findOneAndUpdate(
            { userId: user.id }, // Correct user.id usage here
            { $set: data }, // Update the fields with the new data
            { new: true } // Return the updated document
          );
        } else {
          // If not found, create a new document
          socials = new Socials({
            userId: user.id, // Make sure to pass the userId
            ...data, // Include the data in the new Socials document
          });
          await socials.save();
          console.log("Socials data created successfully:", socials);
        }

        return ({
            success: true,
            message:null,
            data: socials
        });
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}


export async function getSocial () {
    try {
      await dbInit()
        const user = await auth().then((res) => res?.user);
        if (!user) throw new Error("unauthorized request");
        // 
        const socials = await Socials.findOne({ userId: user.id }).select('-_id -userId -createdAt -updatedAt')
        return ({
            success: true,
            message:null,
            data: socials
        });
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}

