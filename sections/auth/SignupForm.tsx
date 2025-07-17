import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { signupSchema } from "./formSchemas"
import yup from 'yup'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import Routes from "@/Routes"
import Link from "next/link"
import useAuthStore from "@/contexts/useAuth"
import { redirect, useRouter } from "next/navigation"
import useAlert from "@/hooks/useAlert"


type SignupRenterFormData = yup.InferType<typeof signupSchema>;

export default function SignupForm () {

  const {setAlert} = useAlert()
  const router = useRouter()
    const [viewPass, setViewPass] = useState(false)
    const form = useForm<SignupRenterFormData>({
      resolver: yupResolver(signupSchema),
      defaultValues: {},
    });
    const {signinWithEmail, loading, user} = useAuthStore()
  

    const onSubmit = async (data: SignupRenterFormData) => {
      const res = await signinWithEmail(data.email, data.password, setAlert)
      if (res.success && res.redirectUrl) {
          return router.replace(res.redirectUrl)
      }
    };

    return (
        <div className=" w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">First Name</FormLabel>
                            <FormControl>
                                <Input type='text' className="bg-slate-50" placeholder="First name" {...field} />
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
                            <FormLabel className="ml-2">Last Name</FormLabel>
                            <FormControl>
                                <Input type='text' className="bg-slate-50" placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Username</FormLabel>
                            <FormControl>
                                <Input type='text' className="bg-slate-50" placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Email</FormLabel>
                            <FormControl>
                                <Input type='email' className="bg-slate-50" placeholder="my@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Password</FormLabel>
                            <FormControl>
                                <Input type='password' className="bg-slate-50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Confirm Password</FormLabel>
                            <FormControl>
                                <Input type='password' className="bg-slate-50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={loading} loading={form.formState.isSubmitting} className=" mt-2">
                        Register
                    </Button>
                </form>
            </Form>
        </div>
    )
}