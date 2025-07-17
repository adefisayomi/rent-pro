"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useWatch } from "react-hook-form"
import yup from 'yup'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { accountInformationSchema, AccountinformationType } from "@/sections/dashboard/formSchemas"
import useAlert from "@/hooks/useAlert"
import { useEffect, useState } from "react"
import { isEqual } from "lodash-es"
import ImageUploader from "./ProfilePhoto"
import useAuthStore from "@/contexts/useAuth"
import { auth } from "@/config"
import { updateEmail, updateProfile } from "firebase/auth"
import DropDownComp from "@/components/DropdownComp"
import { updateUserDetails } from "@/actions/userInformation"




export default function AccountInformation ({title, userDetails}: {title: string, userDetails: AccountinformationType}) {

    const {user, refreshUser } = useAuthStore()
    const {setAlert} = useAlert()
    const [firstName = "", ...lastNameParts] = user?.displayName?.split(" ") || [];
    const lastName = lastNameParts.join(" ");
    const form = useForm<yup.InferType<typeof accountInformationSchema>>({
        resolver: yupResolver(accountInformationSchema),
        defaultValues: {firstName, lastName: lastName, email: user?.email!, phone: userDetails?.phone, whatsapp: userDetails?.whatsapp, username: userDetails?.username, gender: userDetails?.gender }
      })
    const watchedValues = useWatch({ control: form.control });
    const [dataChanged, setDataChanged] = useState(false)

    // ---
    async function onSubmit(data: yup.InferType<typeof accountInformationSchema>) {
        try {
          const { email, firstName, lastName, phone, gender, username, whatsapp } = data;
          const user = auth.currentUser; // Get the current authenticated user
      
          if (!user) throw new Error("User not found");
      
          // Update profile (display name)
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
      
          // Update email if it has changed
          if (email && email !== user.email) {
            await updateEmail(user, email);
          }
        //   
         if (phone || gender || username || whatsapp) {
            await updateUserDetails({phone, gender, username, whatsapp})
         }
          await refreshUser()
          setAlert("Updated successfully", "success");
        } catch (err: any) {
          setAlert(err.message, "error");
        }
      }
      
      useEffect(() => {
        setDataChanged(!isEqual(watchedValues, {...user, ...userDetails}));
      }, [watchedValues, user,, userDetails]);

    //
      
    
    return (
    <Form {...form}>
            
            
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full bg-white rounded-[4px] p-6 border">
                <h2 className="text-xs font-semibold capitalize">{title}</h2>

                <span className='my-4'><ImageUploader/></span>


                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px]">First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="first name"  {...field} className='bg-slate-50' />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px]">Last Name</FormLabel>
                        <FormControl>
                            <Input  placeholder="last name" {...field} className='bg-slate-50' />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="md:gap-2 gap-5 grid grid-cols-1 md:grid-cols-5 ">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="w-full col-span-3">
                        <FormLabel className="text-[11px]">Username</FormLabel>
                        <FormControl>
                            <Input  placeholder="username" {...field} className='bg-slate-50' />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                        <FormItem className="w-full col-span-2">
                            <FormLabel className="text-[11px]">Gender</FormLabel>
                            <FormControl>
                            <DropDownComp
                                title={field.value || "-"}
                                className="border bg-slate-50 rounded-md lowercase"
                                component={
                                <div className="flex w-full flex-col gap-1 items-start">
                                    {['male', 'female'].map((type, index) => (
                                    <Button
                                        size="sm"
                                        onClick={() => field.onChange(type)}
                                        variant="ghost"
                                        key={index}
                                        className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                    >
                                        {type}
                                    </Button>
                                    ))}
                                </div>
                                }
                            />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                </div>
                

                

                <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full col-span-3">
                            <FormLabel className="text-[11px]">Email</FormLabel>
                            <FormControl>
                                <Input  type='email' placeholder="my@email.com " {...field} className='bg-slate-50' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-[11px]">Phone Number</FormLabel>
                            <FormControl>
                                <Input type='tel' placeholder="phone " {...field} className='bg-slate-50' value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-[11px]">Whatsapp</FormLabel>
                            <FormControl>
                                <Input type='tel' placeholder="whatsapp number " {...field} className='bg-slate-50' value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button loading={form.formState.isSubmitting} variant={dataChanged ? 'default' : 'outline'} className="self-end md:w-fit w-full">
                    {dataChanged ? 'Save Changes' : "Updated"}
                </Button>
            </form>
        </Form>
    )
}