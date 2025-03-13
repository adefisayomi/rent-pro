"use client"

import Logo from "@/components/Logo";
import SearchBar from "./searchBar";
import { Menu, X } from "lucide-react"
import { navConfig } from "./navConfig"
import { useState } from "react";
import Link from "next/link";
import UserMenu from "./userMenu";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


export default function MobileHeader() {
  const [open , setopen] = useState(false)
  return (
      <div className="w-full flex items-center justify-between px-3 h-full py-4">
          <span>{!open && <Logo />}</span>

          <div className="flex items-center gap-2">
          <SearchBar />
          <Sheet onOpenChange={setopen}>
            <SheetTrigger asChild>
              <Button size='icon' className="rounded-[8px]">
                { open ? <X className="w-4" /> : <Menu className="w-4" />}
              </Button>
            </SheetTrigger>

            <SheetContent className="bg-slate-50 border-0 p-0">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="text-[10px] mt-2">
                  Lets find you your forever home...
                </SheetDescription>
              </SheetHeader>
              <div className=" flex items-start flex-col w-full">
                {
                  navConfig.map((nav, index) => (
                      <Link key={index} href={nav.href} className="w-full hover:bg-slate-100 text-gray-700 p-4 border-b capitalize hover:uppercase hover:text-primary duration-300">
                        <p className="w-full  font-semibold text-xs ">{nav.title}</p>
                      </Link>
                  ))
                }
              </div>

              <SheetFooter>
                <UserMenu />
              </SheetFooter>
            </SheetContent>
          </Sheet>
          </div>
      </div>
  )
}
