"use client"

import { ReactNode } from "react";
import BaseLayout from "@/sections/layout";
import Routes from "@/Routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalstorage";
import Link from "next/link";
import { User } from "next-auth";




export default function DashboardLayout({children, user}: {children: ReactNode, user: User}) {
  const [activeDiv, setActiveDiv] = useLocalStorage('activeNavDiv',
    {url: Routes.dashboard?.["account management"]?.["account information"] || "", title: 'account information'}
  );


  return (
    <BaseLayout>
        <div className="w-full min-h-screen bg-theme-main py-10">
          <div className="w-full max-w-5xl mx-auto space-y-10">
            <div className="w-full flex items-center gap-2 p-2">
                <Avatar className="border-2 cursor-pointer w-10 h-10 flex items-center justify-center">
                    <AvatarImage className="w-full h-full object-cover" src={user?.image || ''} />
                    <AvatarFallback className="uppercase text-sm">
                    {user?.name?.slice(0, 2) || user?.email?.slice(0, 2) }
                    </AvatarFallback>
                </Avatar>
              <div className="flex flex-col items-start gap-1 cursor-default w-full">
                <h4 className="text-xs font-semibold capitalize">
                  {user?.name || user?.email} / {activeDiv.title}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Manage your account activities.
                </p>
              </div>
            </div>

            <div className="w-full flex items-start justify-between gap-4 ">
              <Navigation activeDiv={activeDiv} setActiveDiv={setActiveDiv} />

              <div  className="flex flex-col gap-5 w-full border bg-white p-6 rounded-sm">
                  <h2 className="text-xs font-semibold capitalize">{activeDiv.title}</h2>
                  {children}
              </div>
              
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
}

const Navigation = ({ activeDiv, setActiveDiv }: NavigationProps) => {
  return (
    <div className="w-full border-x border-t rounded-t-sm max-w-[250px] md:block hidden">
      {Object.entries(Routes.dashboard).map(([section, items], index) => (
        <div key={index} className="w-full">
          <h3 className={cn("p-4 text-xs font-semibold uppercase bg-white border-b text-gray-700", index === 0 && 'rounded-t-sm')}>{section}</h3>
          {typeof items === "string" ? (
            <Link href={items} onClick={() => setActiveDiv({url: items, title: section})}>
              <div
                className={`w-full hover:border-primary border-b p-4 h-[45px] text-muted-foreground flex items-center duration-100 hover:text-primary ${
                  activeDiv === items ? "bg-slate-100 border-l-4 border-l-primary text-primary" : ""
                }`}
              >
                <p className={cn("text-[11px] font-medium capitalize ", activeDiv === items && 'text-primary')}>{section}</p>
              </div>
            </Link>
          ) : (
            Object.entries(items).map(([label, path], subIndex) => (
              <Link href={path} key={subIndex} onClick={() => setActiveDiv({title: label, url: path})}>
                <div
                  className={`w-full hover:border-primary text-muted-foreground duration-100 border-b p-4 h-[45px] flex items-center hover:text-primary ${
                    activeDiv.url === path ? "bg-slate-100 border-l-4 border-l-primary text-primary" : ""
                  }`}
                >
                  <p className={cn("text-[11px] font-medium capitalize", activeDiv.url === path && 'text-primary')}>{label}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      ))}
    </div>
  );
};
