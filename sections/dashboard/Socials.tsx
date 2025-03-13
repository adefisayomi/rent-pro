"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useWatch  } from "react-hook-form"
import { socialsFormSchema } from "./formSchemas"
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
import { updateSocial } from "@/actions/social"
import { useEffect, useState } from "react"
import useAlert from "@/hooks/useAlert"
import { isEqual } from "lodash-es";

type SocialProps = {
    data: any,
    success: boolean,
    message: any
}

export default function SocialsComponent ({socials}: {socials: SocialProps}) {

   
    const form = useForm<yup.InferType<typeof socialsFormSchema>>({
        resolver: yupResolver(socialsFormSchema),
        defaultValues: {facebook: '', twitter: '', instagram: '', linkedin: ''}
      })
      const {setAlert} = useAlert()
      const watchedValues = useWatch({ control: form.control });
    //   
      const [dataChanged, setDataChanged] = useState(false)

    // ---
    async function onSubmit(data: yup.InferType<typeof socialsFormSchema>) {
            if (dataChanged) {
                const { success, message} = await updateSocial(data)
                if (!success && message) {
                    setAlert(message, 'error')
                }
                else setAlert('Updated successfuly', 'success')
                return setDataChanged(false)
            }
      }
      useEffect(() => {
        const handleGetSocials = async () => {
            const {data, success, message} = socials

            // Check if socials data exists and update form values
            if (success && data) {
                form.setValue('facebook', data.facebook || '')
                form.setValue('twitter', data.twitter || '')
                form.setValue('instagram', data.instagram || '')
                form.setValue('linkedin', data.linkedin || '')
            }
            else if (!success && message) {
                setAlert(message, 'warning')
            }
        }

        handleGetSocials()
    }, [socials])

    //
    useEffect(() => {
    setDataChanged(!isEqual(watchedValues, socials.data));
    }, [watchedValues, socials.data]);
    //   

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Facebook</FormLabel>
                        <FormControl>
                            <Input className="truncate" type= 'url' placeholder="https://facebook.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Linkedin</FormLabel>
                        <FormControl>
                            <Input type= 'url' className="truncate"  placeholder="https://linkedin.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Instagram</FormLabel>
                        <FormControl>
                            <Input type= 'url' className="truncate"  placeholder="https://instagram.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Twitter</FormLabel>
                        <FormControl>
                            <Input type= 'url' className="truncate"  placeholder="https://twitter.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button loading={form.formState.isSubmitting} variant={dataChanged ? 'default' : 'outline'} className="self-end w-fit">
                    {dataChanged ? 'Save Changes' : "Updated"}
                </Button>
            </form>
        </Form>
    )
}