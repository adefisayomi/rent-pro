"use client"


import { ChevronLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { SocialAuth } from "@/sections/auth/SocialAuth";
import { LabelSeparator } from "@/components/ui/separator";
import SignupForm from "@/sections/auth/AuthSignup";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function Signin () {
    const router = useRouter()
    return (
        <div className="w-full min-h-screen flex flex-col items-center relative mx-auto max-w-7xl px-2">
            <div className="w-full sticky top-0 left-0 py-2 bg-slate-50 flex flex-row-reverse justify-between items-center md:grid md:grid-cols-3">
                <Button variant='outline' size='icon' onClick={() => router.back()} >
                    <ChevronLeft />
                </Button>
                <span className="md:flex md:justify-center md:items-center"><Logo /></span>
            </div>

            <div className="w-full flex items-center justify-center flex-grow">
                <div className="border rounded-xl px-2 py-4 md:px-8 md:py-8 flex flex-col gap-8 w-full max-w-md bg-white">
                    <div className="w-full flex flex-col items-center gap-2">
                        <h2 className="tracking-normal text-xl text-center capitalize text-primary font-bold">
                        sign-in / create an account
                        </h2>
                        <p className="text-xs text-center">Handle all your business with one account.</p>
                    </div>

                    <SignupForm />

                    <LabelSeparator label='or' className='text-[10.5px]' />

                    <SocialAuth />

                    <p className="text-center text-muted-foreground text-[11px]">By continuing, you have read and agree to our <br /> <Link className="text-primary font-medium underline" href='#'>Terms and Conditions.</Link> </p>
                </div>
            </div>
        </div>
    )
}