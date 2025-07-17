"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuthStore from "@/contexts/useAuth";
import { cn } from "@/lib/utils";
import EmojiPicker from "emoji-picker-react";
import {
  CheckCheck,
  ChevronLeft,
  Ellipsis,
  Mic,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { MessageProps, sendMessage } from "@/actions/messaging";
import useAlert from "@/hooks/useAlert";
import {
  collection,
  onSnapshot,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/config";
import relativeTime from 'dayjs/plugin/relativeTime';
import { messageKey } from "@/constants";
import { LabelSeparator } from "@/components/ui/separator";
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import useResponsive from "@/hooks/useResponsive";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);


export default function Message({
  title,
  accountType,
  allMessages,
}: {
  title: string;
  accountType?: "renter" | "agent";
  allMessages: MessageProps[];
}) {
  const { user } = useAuthStore();
  const [allThreads, setAllThreads] = useState<MessageProps[]>(allMessages);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const { setAlert } = useAlert();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const isDesktop = useResponsive() === 'desktop'

  const activeMessage = useMemo(() => {
    return allThreads.find((m) => m.threadId === activeThreadId) || null;
  }, [allThreads, activeThreadId]);

  const avatarFallback =
    user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || "G";

  useEffect(() => {
    if (!user?.uid) return;

    const q1 = query(
      collection(db, messageKey),
      where("senderId", "==", user.uid)
    );
    const q2 = query(
      collection(db, messageKey),
      where("receiverId", "==", user.uid)
    );

    const unsub1 = onSnapshot(q1, (snap) => handleUpdate(snap.docs));
    const unsub2 = onSnapshot(q2, (snap) => handleUpdate(snap.docs));

    return () => {
      unsub1();
      unsub2();
    };
  }, [user?.uid]);

  const handleUpdate = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    const threads: MessageProps[] = docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as MessageProps),
        threadId: doc.id,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        updatedAt:
          data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
      };
    });

    setAllThreads((prev) => {
      const map = new Map(prev.map((m) => [m.threadId, m]));
      for (const thread of threads) {
        map.set(thread.threadId, thread);
      }
      return Array.from(map.values());
    });
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessage?.message.length]);

  const handleSend = async (text: string) => {
    if (!text || !activeMessage) return;

    const { success, message } = await sendMessage(activeMessage.threadId, {
      message: text,
      receiverId:
        user?.uid === activeMessage.senderId
          ? activeMessage.receiverId
          : activeMessage.senderId,
      images: [],
    });

    if (!success) {
      return setAlert(message || "Failed to send", "error");
    }
  };
  

  const filteredThreads = useMemo(() => {
  if (!search.trim()) return allThreads;

  return allThreads.filter(thread =>
    thread.senderName.toLowerCase().includes(search.toLowerCase()) ||
    thread.receiverName.toLowerCase().includes(search.toLowerCase())
  );
}, [search, allThreads]);
  

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xs font-semibold capitalize pb-4">{title}</h2>

      <div className="border rounded-md min-h-[65vh] grid grid-cols-3">
        {/* SIDEBAR */}
        <div className="w-full hidden border-r col-span-1 md:flex flex-col gap-3 p-2 py-3">
          <div className="w-full flex items-center gap-2 justify-between">
            <div className="w-full flex items-center gap-2">
              <Avatar className="w-9 h-9 border-2">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback className="uppercase text-sm">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h4 className="text-[11px] font-medium">
                  {user?.displayName || user?.email}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {accountType}
                </p>
              </div>
            </div>
            <button><Ellipsis className="w-4 text-muted-foreground" /></button>
          </div>

            {/* Search Bar */}
           <div className="w-full flex items-center gap-2 border rounded-lg p-2 relative">
            <Search className="w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for messages"
              className="text-[10px] outline-none border-none text-muted-foreground w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2">
                <X className="w-3 text-gray-500" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[70vh] flex flex-col gap-2">
            <MessageThreads activeThreadId={activeThreadId} filteredThreads={filteredThreads} setActiveThreadId={setActiveThreadId} />
          </div>
        </div>

        {/* MESSAGE PANEL */}
        <div className="w-full col-span-3 md:col-span-2">
           {!isDesktop && !activeMessage ? (
                // Show message thread list on mobile when no active message
                filteredThreads.length > 0 ? (
                    <MessageThreads
                    activeThreadId={activeThreadId}
                    filteredThreads={filteredThreads}
                    setActiveThreadId={setActiveThreadId}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                    </div>
                )
                ) : !activeMessage ? (
                // Desktop view when no active message
                <div className="w-full h-full flex-col flex items-center justify-center">
                    <img
                    src="/no-messages.svg"
                    className="w-full max-w-[70%]"
                    alt="No active message"
                    />
                </div>
                ) : (
                // Shared chat view for both mobile and desktop when active message exists
                <div className="w-full flex flex-col">
                    <button title="Back" onClick={() => setActiveThreadId(null)} className="md:hidden flex mt-3 ml-3 border rounded-xl aspect-square p-2 items-center justify-center w-14 h-7">
                        <ChevronLeft className="w-4" />
                    </button>
                    <div className="w-full flex items-center gap-2 p-4 border-b">
                    <div className="relative">
                        <Avatar className="border-2 border-white cursor-pointer w-9 h-9 flex items-center justify-center">
                        <AvatarImage
                            className="w-full h-full object-cover rounded-full"
                            src={activeMessage?.senderImage || ''}
                        />
                        <AvatarFallback className="uppercase text-sm">
                            {activeMessage?.senderName?.slice(0, 2)}
                        </AvatarFallback>
                        </Avatar>
                        <div className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white left-6 top-7" />
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-start flex-col">
                        <h4 className="text-[10px] font-medium capitalize">
                            {activeMessage.senderName}
                        </h4>
                        <p className="text-[9px] lowercase text-muted-foreground font-medium">
                            online
                        </p>
                        </div>

                        <div className="flex gap-2 items-start cursor-default">
                        <button className="rounded-full flex items-center justify-center w-7 h-7 bg-slate-50">
                            <Search className="w-4" />
                        </button>
                        <button className="rounded-full flex items-center justify-center w-7 h-7 bg-slate-50">
                            <Ellipsis className="w-4" />
                        </button>
                        </div>
                    </div>
                    </div>

                    {/* Chat Thread + Input */}
                    <ThreadDisplay
                    activeMessage={activeMessage}
                    bottomRef={bottomRef as any}
                    />
                    <MessageInput onSend={handleSend} />
                </div>
                )}
        </div>
      </div>
    </div>
  );
}

const MessageThreads = ({
  filteredThreads,
  activeThreadId,
  setActiveThreadId,
}: {
  filteredThreads: MessageProps[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string) => void;
}) => {
  const userOnline = false;

  return (
    <div className="w-full flex flex-col gap-3 p-2 md:p-0">
      {filteredThreads.map((thread, index) => (
        <div
          key={index}
          onClick={() => setActiveThreadId(thread.threadId)}
          className={cn(
            "w-full flex border md:border-0 items-center gap-2 p-2 rounded-xl cursor-pointer",
            activeThreadId === thread.threadId
              ? "bg-slate-100"
              : "hover:bg-slate-50"
          )}
        >
          <div className="relative">
            <Avatar className="border-2 w-10 border-white h-10">
              <AvatarImage src={thread.senderImage || ""} />
              <AvatarFallback className="uppercase text-sm">
                {thread.senderName?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute w-3 h-3 bg-primary rounded-full border-2 border-white left-6 top-7",
              userOnline && "w-[10px] h-[10px] bg-green-500 animate-ping"
            )} />
          </div>
          <div className="flex flex-col flex-grow max-w-[50%] ">
            <h4 className="text-[10px] font-medium capitalize whitespace-nowrap overflow-hidden text-ellipsis">{thread.senderName}</h4>
            <p
              className="text-[9px] text-muted-foreground truncate  whitespace-nowrap overflow-hidden text-ellipsis"
              title={thread.message?.[thread.message.length - 1]?.message}
            >
              {thread.message?.[thread.message.length - 1]?.message}
            </p>
          </div>
          <div className="flex flex-col items-end text-[10px] text-muted-foreground">
            <p className="whitespace-nowrap overflow-hidden text-ellipsis">{dayjs(thread.updatedAt).format("h:mm A")}</p>
            <CheckCheck className="text-green-500 w-3" />
          </div>
        </div>
      ))}
    </div>
  );
};


const getSmartLabel = (date: dayjs.Dayjs): string => {
  if (date.isToday()) return 'Today';
  if (date.isYesterday()) return 'Yesterday';

  const daysAgo = dayjs().diff(date, 'day');

  if (daysAgo <= 7) return `${daysAgo} days ago`;

  return date.format('MMMM D, YYYY'); // fallback for older dates
};

const ThreadDisplay = ({
  activeMessage,
  bottomRef,
}: {
  activeMessage: MessageProps;
  bottomRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className="w-full flex flex-col justify-between h-[60vh] overflow-x-hidden">
      <div className="flex-grow flex flex-col overflow-y-auto max-h-[60vh] pt-5 pb-10 gap-1 overflow-x-hidden">
        {activeMessage?.message?.length > 0 &&
          activeMessage.message.map((msg, index) => {
            const currentDate = dayjs(msg.createdAt);
            const prevMsg = activeMessage.message[index - 1];
            const prevDate = prevMsg ? dayjs(prevMsg.createdAt) : null;

            const shouldShowLabel =
              !prevDate || !currentDate.isSame(prevDate, 'day');

            return (
              <div key={index} className="relative w-full">
                {shouldShowLabel && (
                  <LabelSeparator className="text-[10px] capitalize text-muted-foreground" label={getSmartLabel(currentDate)} />
                )}
                <div
                  className={cn(
                    'p-2 flex items-start w-full gap-1',
                    msg.fromSender
                      ? 'self-end flex-row-reverse mr-2 rounded-lg rounded-tr-none'
                      : 'ml-2 rounded-lg rounded-tl-none'
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="uppercase text-sm text-primary font-semibold">
                      {msg.fromSender
                        ? activeMessage.senderName?.slice(0, 2)
                        : activeMessage.receiverName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                        <p className={cn("py-2 px-3 bg-slate-100 text-[10px] text-gray-800 rounded-lg", msg.fromSender ? "rounded-tr-none" : "rounded-tl-none")}>
                            {msg.message}
                        </p>
                        <p className={cn("text-[9px] text-gray-600 font-medium lowercase mr-2", msg.fromSender ? 'self-end' : 'self-start')}>
                            {dayjs(msg.createdAt).format("h:mm A")}
                        </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};


const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="w-full p-4 bg-slate-100 rounded-br-md flex flex-col md:flex-row items-center gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="hidden md:flex">
          <button><Smile className="w-4 text-gray-600" /></button>
        </PopoverTrigger>
        <PopoverContent><EmojiPicker open={open} onEmojiClick={(e) => setText((prev) => prev + e.emoji)} /></PopoverContent>
      </Popover>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        className="bg-background text-[11px] h-11 border-none rounded-3xl"
      />

      <span className="flex justify-evenly gap-3 w-full md:w-fit">
        <button><Paperclip className="w-4 text-gray-600" /></button>
        <button><Mic className="w-4 text-gray-600" /></button>
        <button onClick={handleSend}><Send className="w-4 text-gray-600" /></button>
      </span>
    </div>
  );
};

