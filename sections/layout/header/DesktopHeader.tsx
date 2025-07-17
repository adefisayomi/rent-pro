"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navConfig } from "./navConfig";
import UserMenu from "./userMenu";
import Notification from "@/components/Notification";
import Link from "next/link";

export default function DesktopHeader() {
  
  return (
    <header className="w-full min-h-16 shadow-sm z-[50] bg-background/50 backdrop-blur-md flex items-center justify-center sticky top-0 left-0">
      <div className="w-full max-w-8xl grid items-center grid-cols-3 gap-2 px-2 py-3">
        <Logo />
        <div className="flex items-center justify-center">
          <NavMenu />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Notification />
          <UserMenu />
        </div>
      </div>
    </header>
    
  );
}

const NavigationMenuLinkComponent = ({
  href,
  title,
  isActive,
}: {
  href: string;
  title: string;
  isActive: boolean;
}) => (
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={`text-xs font-medium truncate capitalize flex flex-col ${
          isActive ? "text-primary font-semibold" : "text-muted-foreground"
        }`}
      >
        {title}
        {isActive && <span className="w-full bg-primary h-[2px]" />}
      </Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  
);

const NavMenu = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-6 items-center">
        {navConfig.map((nav) => (
          <NavigationMenuLinkComponent
            key={nav.href}
            href={nav.href}
            title={nav.title}
            isActive={pathname === nav.href}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
    
  );
};
