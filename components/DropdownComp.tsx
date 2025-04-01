import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";



export default function DropDownComp({title, component, className}: {title: string | any, component: ReactNode, className?: string}) {
    const [open , setOpen] = useState(false)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={cn("w-full", className)}>
          <Button variant="ghost" className={cn("w-full flex rounded-lg items-center justify-between bg-background text-muted-foreground capitalize", className)}>
            <span>{title}</span>
            <ChevronDown className={cn("w-4 duration-150", open ? 'rotate-180' : 'rotate-0')}/>
          </Button>
        </PopoverTrigger>
        <PopoverContent onClick={() => setOpen(false)} className="w-full max-h-96 overflow-y-auto">{component}</PopoverContent>
      </Popover>
    )
  }