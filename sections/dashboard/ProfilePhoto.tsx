"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSingleImage } from "@/hooks/useGetImage";
import useAlert from "@/hooks/useAlert";
import {Loader2, Upload} from 'lucide-react'
import useAuthStore from "@/contexts/useAuth";
import { deleteSingleImage, uploadSingleImage } from "@/actions/upload";
import {updateProfile, User} from 'firebase/auth'
import { auth } from "@/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ImageUploader() {
    
  const [open, setOpen] = useState(false)
  const {user, refreshUser} = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const {setAlert} = useAlert()
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const image = await getSingleImage(e)
      if (!image.success && image.message) throw new Error(image.message)
        // 
      setUploading(true)
      const downloadUrl = await uploadSingleImage(image.data as File, user?.uid!)
      if (!downloadUrl.success && downloadUrl.message) throw new Error(downloadUrl.message)
        //
      await updateProfile(auth.currentUser!, {photoURL: downloadUrl.data})
      await refreshUser()
      
      return setAlert('Profile photo upload successful', 'success')
    }
    catch(err: any) {
      return setAlert(err.message, 'error')
    }
    finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setUploading(true)
      await deleteSingleImage(user?.photoURL as string)
      await updateProfile(auth.currentUser!, {photoURL: ''})
      await refreshUser()
      setAlert('Profile photo deleted successful', 'info')
      return setOpen(false)
    }
    catch(err: any) {
      return setAlert(err.message, 'error')
    }
    finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-start">
      <Avatar className="border-2 cursor-pointer w-32 h-32 md:w-20 md:h-20 flex items-center justify-center">
        {
          uploading ? <Loader2 className="w-4 animate-spin duration-1000" /> : (
            <>
              <AvatarImage className="w-full h-full object-cover flex" src={user?.photoURL || ''} />
              <AvatarFallback className="uppercase text-sm">
                {user?.displayName?.slice(0, 2)}
              </AvatarFallback>
            </>
          )
        }
        
      </Avatar>

      <label 
        htmlFor="profile_image"
        className="border-2 border-slate-400 hover:bg-muted cursor-pointer md:rounded-3xl rounded-lg capitalize w-[80%] md:w-fit px-3 h-10 flex items-center justify-center text-[12px] font-medium text-gray-800"
      >
        {
        !uploading && 
        <input
          type="file"
          accept="image/*"
          id='profile_image'
          name='profile_image'
          onChange={handleFileChange}
          className="hidden"
        />}
        upload new picture
        </label>

        

        {/* ----------------------------- */}
          <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger asChild>
              <Button disabled={uploading} variant='ghost' className="h-10 md:bg-muted bg-destructive md:rounded-3xl rounded-lg capitalize w-[80%] md:w-fit">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="uppercase text-xs font-medium ">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-[11px] lowercase text-muted-foreground">
                  Are you sure you want to delete this picture ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button size='sm' variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
                <Button size='sm' loading={uploading} onClick={handleDelete}>Continue</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </div>
  );
}
