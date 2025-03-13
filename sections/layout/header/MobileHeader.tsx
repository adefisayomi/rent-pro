import Logo from "@/components/Logo";
import SearchBar from "./searchBar";
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { navConfig } from "./navConfig"
import Routes from "@/Routes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"
import { handleSignOut } from "@/actions/auth";
import { useRouter } from "next/navigation";



export default function MobileHeader () {
    return (
        <div className="w-full flex items-center justify-between px-3 h-full py-4">
           <Logo />

           <div className="flex items-center gap-2">
            <SearchBar />
            <DropdownMenuContainer />
           </div>
        </div>
    )
}

const DropdownMenuContainer = () => {
  const router = useRouter()
  const [open , setopen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

    return (
      <Popover onOpenChange={setopen}>
      <PopoverTrigger asChild>
          <Button size='icon'>
              { open ? <X /> : <Menu />}
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen flex flex-col p-0 mr-5" sideOffset={20}>
        <div className="p-4 flex items-start gap-2 flex-col w-full">

        {
              navConfig.map((nav, index) => (
                  <Link href={nav.href} className="w-full">
                    <p className="w-full capitalize font-semibold text-xs py-3 border-b">{nav.title}</p>
                  </Link>
              ))
          }

            <Link href={Routes.dashboard["account management"]["account information"]} className="w-full">
              <p className="w-full capitalize font-semibold text-xs py-3 border-b">profile</p>
            </Link>

          {/*  */}
            {
              user ? (
                <Button onClick={async () => await handleSignOut()} variant='outline' size='sm' className="text-[11px] flex items-center gap-2">
                  <LogOut className="w-4" />
                  Sign-Out
                </Button>
              ) : (
                  <Button onClick={() => router.push(Routes.login)} className="w-full">Sign In / Create Account</Button>
              )
            }
        </div>

        <div className="w-full flex items-center justify-center border-t p-4 bg-muted">
          <p className="text-[10px] cursor-default text-muted-foreground">RentHouse &copy; 2024 All Right Reserved.</p>
        </div>
      </PopoverContent>
    </Popover>
    )
  }
  