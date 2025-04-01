"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import useAuthStore from "@/contexts/useAuth";
import { cn } from "@/lib/utils";
import EmojiPicker from 'emoji-picker-react';
import { Ellipsis, File, Mic, Paperclip, Search, Send, Smile } from 'lucide-react';
import { useState } from "react";
import dayjs from "dayjs";


export default function Message ({title}: {title: string}) {
    const {user} = useAuthStore()
    const avatarFallback = user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || "G";

    return (
        <div className="w-full flex flex-col">
            <h2 className="text-xs font-semibold capitalize pb-4">{title}</h2>

            <div className="border rounded-lg min-h-[75vh] grid grid-cols-3">
                <div className="border-r col-span-1 h-full"></div>
                <div className="col-span-2 h-full flex flex-col">
                    <MessageBoxHeader />

                    <div className="w-full flex-grow flex flex-col overflow-y-auto max-h-[60vh] pb-10 pt-5 gap-4">
                        {
                            _messages && _messages.length > 0 && _messages.map((msg, index) => (
                                <div className={cn("p-2 flex items-start w-full max-w-[80%]", msg.senderId === 'user1' ? 'self-end flex-row-reverse rounded-lg rounded-tr-none mr-2' : 'rounded-lg rounded-tl-none ml-2')} key={index}>
                                    <Avatar className="w-8 h-8 ">
                                        <AvatarImage
                                            src={user?.photoURL || ""}
                                            className="w-full h-full object-cover rounded-full"
                                            alt="User Avatar"
                                        />
                                        <AvatarFallback className="uppercase text-sm text-primary font-bold">{avatarFallback}</AvatarFallback>
                                    </Avatar>
                                <div key={index} className="flex flex-col gap-1">
                                    <p className={cn("p-4 bg-slate-100 text-[11px] text-gray-800", msg.senderId === 'user1' ? 'rounded-lg rounded-tr-none mr-2' : 'rounded-lg rounded-tl-none ml-2')}>{msg.message}</p>
                                    <p className={cn("text-[11px] font-semibold lowercase text-gray-600",  msg.senderId === 'user1' && "self-end mr-2")}>{dayjs(msg.createdAt).format("h:mm A")}</p>
                                </div>
                                </div>
                            ))
                        }
                    </div>
                    <MessageBox />
                </div>
            </div>
        </div>
    )
}

const MessageBox = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="w-full p-4 bg-slate-100 rounded-br-lg flex items-center gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <button><Smile className='w-6 text-gray-600'/></button>
                </PopoverTrigger>
                <PopoverContent className="w-fit"><EmojiPicker open={open}/></PopoverContent>
            </Popover>

            <Input placeholder="Type message..." className="bg-background h-11 border-none rounded-3xl" />

            <span className="flex items-center gap-3 ">
                <button><Paperclip className='w-5 text-gray-600'/></button>
                <button><Mic className='w-5 text-gray-600'/></button>
                <button><Send className='w-5 text-gray-600'/></button>
            </span>
        </div>
    )
}


const MessageBoxHeader = () => {
    const [open, setOpen] = useState(false)
    const {user} = useAuthStore()
    const avatarFallback = user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || "G";
    return (
        <div className="w-full p-4 border-b flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10 ">
                    <AvatarImage
                        src={user?.photoURL || ""}
                        className="w-full h-full object-cover rounded-full"
                        alt="User Avatar"
                    />
                    <AvatarFallback className="uppercase text-sm">{avatarFallback}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <h2 className="text-xs font-semibold text-slate-700 capitalize">{user?.displayName || user?.email}</h2>
                    <h2 className="text-[11px] font-medium text-muted-foreground lowercase">online</h2>
                </div>
            </div>


            <span className="flex items-center gap-3 ">
                <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><Search className='w-5 text-gray-600'/></button>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                    <button className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200"><Ellipsis className='w-5 text-gray-600'/></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        
                    </PopoverContent>
                </Popover>
            </span>
        </div>
    )
}


type MessageProps = {
    id: string;
    message: string;
    createdAt: string;
    senderId: string;
    receiverId: string;
    images?: string[];
  };

const _messages: MessageProps[] = [
    {
      id: "msg1",
      message: "Hey, I found a great apartment for rent!",
      createdAt: "2025-03-30T10:15:00Z",
      senderId: "user1",
      receiverId: "user2",
      images: ["https://source.unsplash.com/800x600/?apartment,interior"]
    },
    {
      id: "msg2",
      message: "Nice! Can you share more pictures?",
      createdAt: "2025-03-30T10:16:30Z",
      senderId: "user2",
      receiverId: "user1"
    },
    {
      id: "msg3",
      message: "Sure! Here are some more photos of the place.",
      createdAt: "2025-03-30T10:18:45Z",
      senderId: "user1",
      receiverId: "user2",
      images: [
        "https://source.unsplash.com/800x600/?modern-house",
        "https://source.unsplash.com/800x600/?living-room",
        "https://source.unsplash.com/800x600/?bedroom"
      ]
    },
    {
      id: "msg4",
      message: "This looks amazing! Where is it located?",
      createdAt: "2025-03-30T10:20:10Z",
      senderId: "user2",
      receiverId: "user1"
    },
    {
      id: "msg5",
      message: "It's in downtown Manhattan, close to the subway.",
      createdAt: "2025-03-30T10:21:50Z",
      senderId: "user1",
      receiverId: "user2"
    },
    {
      id: "msg6",
      message: "I love the open kitchen concept!",
      createdAt: "2025-03-30T10:23:30Z",
      senderId: "user2",
      receiverId: "user1",
      images: ["https://source.unsplash.com/800x600/?kitchen"]
    },
    {
      id: "msg7",
      message: "Yes, and it comes fully furnished!",
      createdAt: "2025-03-30T10:25:00Z",
      senderId: "user1",
      receiverId: "user2"
    },
    {
      id: "msg8",
      message: "That's awesome! What's the monthly rent?",
      createdAt: "2025-03-30T10:26:45Z",
      senderId: "user2",
      receiverId: "user1"
    },
    {
      id: "msg9",
      message: "It's $2,500 per month, including utilities.",
      createdAt: "2025-03-30T10:28:20Z",
      senderId: "user1",
      receiverId: "user2"
    },
    {
      id: "msg10",
      message: "This sounds perfect! Can we schedule a tour?",
      createdAt: "2025-03-30T10:30:00Z",
      senderId: "user2",
      receiverId: "user1"
    }
  ];