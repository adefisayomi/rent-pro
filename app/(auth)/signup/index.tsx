"use client"


import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Routes from "@/Routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignupForm from "@/sections/auth/SignupForm";



export default function Signup () {
    const router = useRouter()
    return (
        <div className="w-full h-screen bg-slate-50 flex items-center justify-start relative flex-col">
            <header className="w-full max-w-7xl flex flex-row-reverse items-center md:grid grid-cols-3 py-4 px-2 bg-slate-50 sticky top-0 left-0">
                <Button variant='outline' className="bg-slate-50" size='icon' onClick={() => router.back()} >
                    <ArrowLeft className="w-4 text-primary" />
                </Button>
                <span className="justify-start items-center md:justify-center flex w-full">
                    <Logo />
                </span>
            </header>

            <div className="w-full max-w-[450px] flex-grow flex items-center justify-center py-10">
                <div className="w-full py-6 px-8 border rounded-lg bg-white flex flex-col gap-6 items-center">
                    <div className="w-full flex flex-col gap-2 items-center">
                        <h2 className="tracking-normal text-xl text-center capitalize text-primary font-semibold">
                            create account
                        </h2>
                        <p className="text-[11px] text-muted-foreground text-center">Do not have an account?</p>
                    </div>

                    <Tabs defaultValue="agent" className="w-full">
                        <TabsList className="w-full grid grid-cols-2 gap-2 mb-8">
                            <TabsTrigger value="agent" className="">agent</TabsTrigger>
                            <TabsTrigger value="renter" className="">renter</TabsTrigger>
                        </TabsList>
                        <TabsContent value="agent">
                            <SignupForm />
                        </TabsContent>

                        <TabsContent value="renter">
                            hell renter
                        </TabsContent>
                    </Tabs>

                    <p className="text-center text-muted-foreground text-[11px]">Already have an account ? <Link className="text-primary font-semibold" href={Routes.login}>Login</Link> </p>
                </div>
            </div>
        </div>
    )
}