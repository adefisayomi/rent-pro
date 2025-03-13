"use server"

import { auth } from "@/auth";
import { errorMessage } from "@/constants";
import dbInit from "@/server/db";
import User from "@/server/models/user";


export async function getUser() {
  
    try {
      await dbInit()
      const user = await auth().then(res => res?.user)
      const dbUser = await User.findOne({ email:  user.email }).select("-_id -__v -createdAt -updatedAt -email");
      console.log(dbUser)
      return ({
        success: true,
        message: null,
        data: {
            ...user, gender: dbUser?.gender, username: dbUser?.username, phone: dbUser?.phone
        }
    });;
    } catch (err: any) {
        return errorMessage(err.message);
    }
  }

  
  export async function updateUser(data: { gender: string; phone: string }) {
    try {
      await dbInit();
      
      const user = await auth().then(res => res?.user);
      if (!user?.email) {
        return {
          success: false,
          message: "User not authenticated",
          data: null,
        };
      }
  
      const dbUser = await User.findOneAndUpdate(
        { email: user.email },
        { $set: data }, // Correctly apply updates
        { new: true, select: "-_id -__v -createdAt -updatedAt -email" }
      );
  
      if (!dbUser) {
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }
  
      return {
        success: true,
        message: "User updated successfully",
        data: dbUser, // Return the updated user if needed
      };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }
  