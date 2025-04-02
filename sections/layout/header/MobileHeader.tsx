"use client";


import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import SearchBar from "./searchBar";
import { Dot, LoaderCircle, Menu, Wrench, X } from "lucide-react";
import { navConfig } from "./navConfig";
import Link from "next/link";
import UserMenu from "./userMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Notification from "@/components/Notification";
import useAuthStore from "@/contexts/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Routes from "@/Routes";
import { useRouter } from "next/navigation";



export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsSticky(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsSticky(false);
      }, 3000); // 5 seconds idle time before removing sticky
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);


  return (
    <div
      className={`w-full h-full grid grid-cols-3 px-2 min-h-16 py-4 shadow-sm z-50 bg-background/50 border-b backdrop-blur-md transition-all duration-300 
        ${isSticky ? "sticky top-0 left-0" : "static top-0 left-0"}`}
    >
      <div className="flex items-center justify-start">
        {!open && <Logo />}
      </div>

      <div className="flex items-center justify-center">{user && <Notification />}</div>

      <div className="flex items-center justify-end gap-2">
        <SearchBar />
        <Dot className="w-4 h-4" />
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            {user ? (
              <Avatar className="border-2 border-primary p-[2px] cursor-pointer w-11 h-11 flex items-center justify-center">
                <AvatarImage className="w-full h-full object-cover rounded-full" src={user?.photoURL || ""} />
                <AvatarFallback className="uppercase text-sm">
                  {user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Button size="icon" className="rounded-[8px]">
                {open ? <X className="w-4" /> : <Menu className="w-4" />}
              </Button>
            )}
          </SheetTrigger>

          <SheetContent className="bg-slate-50 border-0 p-0">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <SheetDescription className="text-[11px] mt-2 text-gray-600">
                One home at a time...
              </SheetDescription>
            </SheetHeader>
            <div className="flex items-start flex-col w-full overflow-y-auto">
              
              {navConfig.map((nav, index) => (
                <Link
                  key={index}
                  href={nav.href}
                  onClick={() => setOpen(false)}
                  className="w-full hover:bg-slate-100 text-gray-700 p-4 border-b capitalize hover:uppercase hover:text-primary duration-300"
                >
                  <p className="w-full font-semibold text-xs ">{nav.title}</p>
                </Link>
              ))}

            {user && <DashboardNav setOpen={setOpen}/>}
            </div>

            <SheetFooter>
              <UserMenu />

              <div className="w-full flex items-center justify-center border-t p-4 rounded-b-md mt-4">
                <p className="text-[10px] cursor-default text-muted-foreground">RentHouse &copy; 2024 All Right Reserved.</p>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}



export function DashboardNav({ setOpen }: { setOpen: Function }) {
  const router = useRouter();
  const {claims, user} = useAuthStore()
  const passwordResetActive = user?.providerData?.some(res => res.providerId === "password");

  const handleNavigation = (path: string) => {
    router.push(path); // Navigate first
    setTimeout(() => setOpen(false), 100); // Close after navigation
  };

  return (
    <Accordion type="multiple" className="w-full gap-0">
      <div className="h-12 px-4 flex items-center gap-2 bg-muted border-b border-primary">
        <h2 className="text-xs text-gray-600 font-semibold uppercase">Dashboard</h2>
        <Wrench className="w-4 text-primary" />
      </div>

      {Object.entries(Routes.dashboard).map(([section, items], index) => {
         if (section === "professional tools" && claims?.accountType !== "agent") return null;
        return (<div key={index} className="w-full">
          <AccordionItem value={section}>
            <AccordionTrigger className="w-full font-medium text-[11px] rounded-none hover:no-underline hover:bg-slate-100 text-gray-700 p-4 pl-6 border-b capitalize">
              {section}
            </AccordionTrigger>

            <AccordionContent>
              {typeof items === "string" ? (
                JSON.stringify(items).toLowerCase() === "password" && passwordResetActive && (
                <div onClick={() => handleNavigation(items)}>
                  <div className="w-full hover:border-primary border-b p-4 h-[45px] text-muted-foreground flex items-center duration-100 hover:text-primary cursor-pointer">
                    <p className="text-[11px] font-medium capitalize pl-6">{section}</p>
                  </div>
                </div>
              )) : (
                Object.entries(items)
                .filter(([label]) => label.toLowerCase() !== "password" || passwordResetActive)
                .map(([label, path], subIndex) => (
                  <div key={subIndex} onClick={() => handleNavigation(path)}>
                    <div className="w-full hover:border-primary text-muted-foreground duration-100 border-b p-4 h-[45px] flex items-center hover:text-primary cursor-pointer">
                      <p className="text-[11px] font-medium capitalize pl-6">{label}</p>
                    </div>
                  </div>
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        </div>)
     })}
    </Accordion>
  );
}