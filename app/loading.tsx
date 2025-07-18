"use client"

import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname().slice(1).replaceAll('/', '-');
  return (
    <div className="fixed flex items-center justify-center flex-col gap-3 top-0 left-0 w-full h-[100vh] bg-slate-50">
      <div className="animate-blink">
        <Logo/>
      </div>
      <p className="text-muted-foreground font-medium text-[10px] capitalize">{pathname}</p>
    </div>
  );
}
