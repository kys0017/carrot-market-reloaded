"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);

  return (
    <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${message.userId === userId ? "justify-end" : ""}`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar || ""}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : ""}`}
          >
            <span
              className={`rounded-md ${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5`}
            >
              {message.paylaod}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
