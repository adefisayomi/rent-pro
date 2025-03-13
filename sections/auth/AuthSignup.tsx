import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { signinSchema } from "./formSchemas"
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
import { useActionState } from 'react';
import { authenticateWithEmail } from "@/actions/auth"
import useAlert from "@/hooks/useAlert"


type SignupRenterFormData = yup.InferType<typeof signinSchema>;

export default function SignupForm () {

    const [viewPass, setViewPass] = useState(false)
    const {setAlert} = useAlert()
    const form = useForm<SignupRenterFormData>({
      resolver: yupResolver(signinSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });
    const [errorMessage, formAction, isPending] = useActionState(
      authenticateWithEmail,
      undefined,
    );
    
  
  
    const onSubmit = async (data: SignupRenterFormData) => {
      await formAction(data)
      if (errorMessage) {
        return setAlert(errorMessage, 'error')
      }
    };

    return (
        <div className=" w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Email</FormLabel>
                            <FormControl>
                                <Input type='email' placeholder="my@email.com" {...field} />
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
                              <div className="w-full relative items-center flex">
                              <Input type= {viewPass ? 'text' : 'password'} placeholder="Password" {...field} />
                              <div className="absolute right-2 cursor-pointer" onClick={() => setViewPass(prev => !prev)}>{ viewPass ? <Eye className="w-4" /> : <EyeOff className="w-4" /> }</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full py-2 items-center flex justify-between gap-1 ">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember-me" className='w-6 h-6' />
                          <label
                            htmlFor="remember-me"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Remeber me 
                          </label>
                        </div>
                        <Link href={Routes.resetPassword} className="text-primary text-xs font-medium hover:underline">Forgot Password?</Link>
                    </div>

                    <Button loading={form.formState.isSubmitting} className=" mt-4" size='lg'>
                        Continue
                    </Button>
                </form>
            </Form>
        </div>
    )
}