"use client"

import { ReactNode, Suspense, useEffect, useState } from "react";
import BaseLayout from "@/sections/layout";
import Routes from "@/Routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalstorage";
import Link from "next/link";
import useAuthStore from "@/contexts/useAuth";
import {  usePathname, useRouter } from "next/navigation";
import useAlert from "@/hooks/useAlert";
import { Loader2 } from "lucide-react";


export default function DashboardLayout({children, accountType}: {children: ReactNode, accountType?: 'renter' | 'agent'}) {
  const {user} = useAuthStore()
  const pathname = usePathname()
  const [disableContainer, setDisableContainer] = useState(false)
  const [activeDiv, setActiveDiv] = useLocalStorage('activeNavDiv',{url: '', title: ''});

  useEffect(() => {
      const setCurrentPath = (list: any) => {
          Object.entries(list).forEach(([key, value]) => {
            if (value && typeof value === 'object') {
              return setCurrentPath(value)
            }
            else if (value === pathname) {
              return setActiveDiv({url: value, title: key})
            }
          })
          return
      }
      setCurrentPath(Routes.dashboard)
  }, [pathname])

  useEffect(() => {
    if (pathname === Routes.dashboard["professional tools"]["add new properties"] || 
      pathname === Routes.dashboard["account management"]["account information"]
    ) {
      return setDisableContainer(true)
    }
    
  }, [pathname])


  return (
    <BaseLayout>
        <div className="w-full min-h-screen bg-theme-main py-10">
          <div className="w-full max-w-5xl mx-auto space-y-5">
            <div className="w-full flex items-center gap-2 p-2 relative">
                <Avatar className="border-2 cursor-pointer w-11 h-11 flex items-center justify-center">
                    <AvatarImage className="w-full h-full object-cover rounded-full" src={user?.photoURL || ''} />
                    <AvatarFallback className="uppercase text-sm">
                    {user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) }
                    </AvatarFallback>
                </Avatar>
              <div className="flex flex-col items-start gap-1 cursor-default w-full">
                <h4 className="text-xs font-semibold capitalize">
                  {user?.displayName || user?.email} / {activeDiv.title}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Manage your account activities.
                </p>
              </div>

              {accountType && <span className="absolute rounded-full h-6 flex items-center justify-center w-6  -bottom-1 left-0 border-2 border-slate-50 text-[11px] font-medium capitalize bg-black text-white">
                {accountType.split("").at(0)}
                </span>}
            </div>

            <div className="w-full rounded-[4px] flex items-start justify-between gap-4 px-2 md:px-0">
              <Navigation activeDiv={activeDiv} setActiveDiv={setActiveDiv} accountType={accountType!}/>

              {
                disableContainer ? <>{children}</> : (
                <div  className={cn("flex flex-col gap-5 w-full border bg-white p-6 rounded-[4px] min-h-80")}>
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin " />
                    </div>
                  }>
                    {children}
                  </Suspense>
                </div>
                )
              }

              
              
            </div>
          </div>
        </div>
    </BaseLayout>
  );
}


interface NavigationProps {
  activeDiv: {
    url: string,
    title: string
  };
  setActiveDiv: (path: {title: string, url:string}) => void;
  accountType?: 'renter' | 'agent'
}

const Navigation = ({ activeDiv, setActiveDiv, accountType }: NavigationProps) => {
  const { logout, user } = useAuthStore();
  const router = useRouter()

  // Only show password reset link if the user signed up with email/password
  const passwordResetActive = user?.providerData?.some(res => res.providerId === "password");
  const {setAlert} = useAlert()

  const handleLogout = async () => {
    const res = await logout(setAlert);
    if (res.success && res.redirectUrl) {
      return router.replace(res.redirectUrl);
    }
  };

  return (
    <div className="w-full border-x border-t rounded-[4px] max-w-[250px] md:block hidden">
      {Object.entries(Routes.dashboard).map(([section, items], index) => {
        // Skip "professional tools" if the user is not an agent
        if (section === "professional tools" && accountType !== "agent") return null;

        return (
          <div key={index} className="w-full">
            <h3 className={cn("p-4 text-xs font-semibold uppercase bg-white border-b text-gray-700", index === 0 && "rounded-t-[4px]")}>
              {section}
            </h3>

            {
              Object.entries(items)
                .filter(([label]) => label.toLowerCase() !== "password" || passwordResetActive) // Only show 'password' link when allowed
                .map(([label, path], subIndex) => (
                  <Link href={path} key={subIndex} onClick={() => setActiveDiv({ title: label, url: path })}>
                    <div
                      className={cn("w-full hover:border-primary text-muted-foreground duration-100 border-b p-4 h-[45px] flex items-center hover:text-primary", activeDiv.url === path && "bg-slate-100 border-l-4 border-l-primary text-primary")}
                    >
                      <p className={cn("text-[11px] font-medium capitalize", activeDiv.url === path && "text-primary")}>
                        {label}
                      </p>
                    </div>
                  </Link>
                ))
            }
          </div>
        );
      })}

      <button
        onClick={handleLogout}
        className="w-full hover:border-primary text-muted-foreground text-[11px] font-medium capitalize duration-100 border-b p-4 h-[45px] flex items-center hover:text-primary"
      >
        Logout
      </button>
    </div>
  );
};