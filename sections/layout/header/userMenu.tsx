"use client"

import { LoaderCircle, LogOut, Settings } from "lucide-react";
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Routes from "@/Routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { handleSignOut } from "@/actions/auth";
import useResponsive from "@/hooks/useResponsive";


// NoUser component for unauthenticated state
const NoUser = memo(() => (
  <div className="flex items-center gap-3">
    <Link href={Routes.login}>
      <Button variant='outline' size='sm'>Sign-In / Create account</Button>
    </Link>
  </div>
));
NoUser.displayName = 'NoUser'





export default function UserMenu () {

  const isDesktop = useResponsive() === 'desktop'
  const {data, status} = useSession()
  const user = data?.user
  const isLoading = status === 'loading'
  const router = useRouter()
  if (isLoading) return <LoaderCircle className="w-4 h-4 animate-spin" />
  const activeDiv = typeof window !== 'undefined' 
  ? JSON.parse(window.localStorage.getItem('activeNavDiv') || '{"url": "' + Routes.dashboard["account management"]["account information"] + '"}')
  : { url: Routes.dashboard["account management"]["account information"] };


  if (!user) return <NoUser />

  return (
    <>
    {
      isDesktop ? (
        <Popover>
          <PopoverTrigger asChild>
              <Avatar className="border-2 cursor-pointer w-9 h-9 flex items-center justify-center">
                <AvatarImage className="w-full h-full object-cover" src={user?.image || ''} />
                <AvatarFallback className="uppercase text-sm">
                  {user?.name?.slice(0, 2) || user?.email?.slice(0, 2) }
                </AvatarFallback>
              </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] flex flex-col p-0 mr-5" sideOffset={15}>
            <div className="p-4 flex items-start gap-2">
              <Avatar className="border-2 cursor-pointer w-10 h-10 flex items-center justify-center">
                <AvatarImage className="w-full h-full object-cover" src={user?.image || ''} />
                <AvatarFallback className="uppercase text-sm">
                  {user?.name?.slice(0, 2) || user?.email?.slice(0, 2) }
                </AvatarFallback>
              </Avatar>

              <div className="flex w-full flex-col gap-6">
                <div className="flex flex-col">
                  <p className=" text-xs capitalize">{user?.name || 'Guest'}</p>
                  <p className="text-muted-foreground text-[11px] lowercase">{user?.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => router.push(activeDiv.url)} variant='outline' size='sm' className="text-[11px] flex items-center gap-2">
                    <Settings className="w-4" />
                    Manage account
                  </Button>

                  <Button onClick={ async () => await handleSignOut() } variant='outline' size='sm' className="text-[11px] flex items-center gap-2">
                    <LogOut className="w-4" />
                    Sign-Out
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center border-t p-4 bg-muted rounded-b-md">
              <p className="text-[10px] cursor-default text-muted-foreground">RentHouse &copy; 2024 All Right Reserved.</p>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button onClick={() => router.push(activeDiv.url)} variant='outline'  className="text-[11px] flex items-center gap-2">
                <Settings className="w-4" />
                Manage account
              </Button>

              <Button onClick={ async () => await handleSignOut() } variant='outline'  className="text-[11px] flex items-center gap-2">
                <LogOut className="w-4" />
                Sign-Out
              </Button>
            </div>
      )
    }
    </>
  )
}
