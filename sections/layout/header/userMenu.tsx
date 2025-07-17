"use client";

import { memo, useEffect } from "react";
import { LoaderCircle, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Routes from "@/Routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import useAuthStore from "@/contexts/useAuth";
import useAlert from "@/hooks/useAlert";

// NoUser component for unauthenticated state
const NoUser = memo(() => (
  <Link href={Routes.login}>
    <Button className="md:w-fit w-full">Sign-In / Create account</Button>
  </Link>
  
));
NoUser.displayName = "NoUser";

// Main UserMenu component
const UserMenu = memo(() => {
  const { setAlert } = useAlert();
  const router = useRouter();
  const isDesktop = useResponsive() === "desktop";
  const { user, loading, logout } = useAuthStore();

  const handleLogout = async () => {
    const res = await logout(setAlert);
    if (res.success && res.redirectUrl) {
      router.replace(res.redirectUrl);
    }
  };

  useEffect(() => {
    if (user) {
      router.prefetch(Routes.dashboard["account management"]["account information"]);
    }
  }, [user, router]);

  if (loading) return <LoaderCircle className="w-4 h-4 animate-spin" />;
  if (!user) return <NoUser />;

  const avatarFallback = user.displayName?.slice(0, 2) || user.email?.slice(0, 2) || "G";

  return isDesktop ? (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="w-10 h-10 border-2 border-muted p-[1px] cursor-pointer ">
          <AvatarImage
            src={user.photoURL || ""}
            className="w-full h-full object-cover rounded-full"
            alt="User Avatar"
          />
          <AvatarFallback className="uppercase text-sm">{avatarFallback}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] flex flex-col p-0 mr-5" sideOffset={15}>
        <div className="p-4 flex items-start gap-2">
          <Avatar className="w-11 h-11 border-2 border-muted p-[1px]">
            <AvatarImage className="w-full h-full object-cover rounded-full" src={user.photoURL || ""} alt="User Avatar" />
            <AvatarFallback className="uppercase text-sm">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 w-full">
            <div>
              <p className="text-xs capitalize">{user.displayName || "Guest"}</p>
              <p className="text-muted-foreground text-[11px] lowercase">{user.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => router.push(Routes.dashboard["account management"]["account information"])}
                variant="outline"
                size="sm"
                className="text-[11px] flex items-center gap-2"
              >
                <Settings className="w-4" />
                Manage Account
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-[11px] flex items-center gap-2"
              >
                <LogOut className="w-4" />
                Sign-Out
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center border-t p-4 bg-muted rounded-b-md">
          <p className="text-[10px] text-muted-foreground">RentCreeb &copy; 2024 All Rights Reserved.</p>
        </div>
      </PopoverContent>
    </Popover>
    
  ) : (
    <div className="grid grid-cols-2 gap-4 w-full">
      <Button
        onClick={() => router.push(Routes.dashboard["account management"]["account information"])}
        variant="outline"
        className="text-[11px] flex items-center gap-2"
      >
        <Settings className="w-4" />
        Manage Account
      </Button>
      <Button onClick={handleLogout} variant="outline" className="text-[11px] flex items-center gap-2">
        <LogOut className="w-4" />
        Sign-Out
      </Button>
    </div>
    
  );
});

UserMenu.displayName = "UserMenu";

export default UserMenu;
