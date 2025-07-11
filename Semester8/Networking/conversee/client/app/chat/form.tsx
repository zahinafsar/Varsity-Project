"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { v4 as uuid } from "uuid";
import { api } from "@/utils/api";
import { connectWebSocket } from "@/utils/socket";

let currentMessageId = uuid();

export function ChatForm({
  username,
  receiver,
}: {
  username: string;
  receiver?: string;
}) {
  const clientRef = useRef<Client | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = useState("");
  const callTrigger = () => setTrigger(uuid());
  const [messages, setMessages] = useState<Message[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const disconnect = () => {
    if (clientRef.current) clientRef.current?.deactivate();
  };

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    api
      .get(receiver ? `/messages/${username}/${receiver}` : "/messages")
      .then((data) => {
        // Data is already sorted by timestamp from the backend
        setMessages(data.reverse());
      })
      .catch((err) => console.error("Error fetching messages:", err));

    const client = connectWebSocket((c) => {
      c.subscribe("/topic/messages", (message) => {
        const msg = JSON.parse(message.body) as Message;
        setMessages((prev) => [msg, ...prev]); // Changed from [msg, ...prev]
        callTrigger();
        setRealtimeMessages((prev) =>
          prev.filter((p) => p.username !== msg.username)
        );
      });

      c.subscribe("/topic/typing", (message) => {
        callTrigger();
        const msg = JSON.parse(message.body) as Message;
        console.log(msg);
        if (msg.username === username) return;
        if ((!msg.receiver && !receiver) || (msg.receiver === username && receiver)){
          setRealtimeMessages((prev) => {
            if (msg.content.length === 0) {
              return prev.filter((p) => p.username !== msg.username);
            }
            const existingMessage = prev.findIndex(
              (p) => p.username === msg.username
            );
            if (existingMessage !== -1) {
              prev[existingMessage] = msg;
              return prev;
            }
            return [msg, ...prev];
          });
        }
      });
      c.subscribe("/topic/files", (message) => {
        const fileMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, fileMessage]); // Changed from [fileMessage, ...prev]
      });
    });
    clientRef.current = client;
    return () => disconnect();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, realtimeMessages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString();

    if (clientRef.current && message?.trim()) {
      clientRef.current.publish({
        destination: "/app/send",
        body: JSON.stringify({
          id: currentMessageId,
          username: username,
          receiver: receiver,
          content: message,
        }),
      });
      e.currentTarget.reset();
    }
    currentMessageId = uuid();
  };

  const handleTyping = (message: string) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/typing",
        body: JSON.stringify({
          id: currentMessageId,
          username: username,
          receiver: receiver,
          content: message,
        }),
      });
    }
  };

  const getActiveTyping = useCallback(() => {
    return realtimeMessages;
  }, [trigger]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clientRef.current?.connected) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("receiver", receiver || "");

    try {
      const response = await fetch("http://localhost:8080/app/file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Upload failed");
      }

      // Remove direct message addition since it will come through websocket
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleFileDownload = async (fileUrlPathName: string) => {
    try {
      const response = await fetch(`http://localhost:8080/${fileUrlPathName}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrlPathName; // Set the file name for download

      // Append to the document
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("File download error:", error);
      alert("Failed to download file");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome, <span className="text-blue-600">{username}</span>
      </h1>
      <div
        ref={messagesContainerRef}
        className="flex flex-col-reverse h-[500px] overflow-y-scroll rounded-xl border border-gray-200 bg-white/80 p-6 shadow-inner backdrop-blur-sm transition-all duration-300 ease-in-out"
      >
        {getActiveTyping().map((msg) => (
          <div
            key={msg.id}
            className="p-3 pr-5 rounded-2xl mb-2 bg-gray-100 self-start text-gray-800 max-w-[80%] animate-pulse"
          >
            <div className="text-sm text-gray-500 italic flex items-end gap-1">
              <span className="font-medium">{msg.username}</span>
              <span>is typing</span>
              <TypingAnimation />
            </div>
            {msg.content}
          </div>
        ))}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-xl mb-3 max-w-[80%] transition-all duration-300 ease-in-out relative group ${
              msg.username === username
                ? "bg-blue-600 self-end text-white ml-auto"
                : "bg-gray-100 self-start text-gray-800"
            }`}
          >
            {msg.content.startsWith("files/") ? (
              <>
                {msg.username !== username && (
                  <span className="text-xs font-medium text-gray-500 mb-1 block">
                    {msg.username}
                  </span>
                )}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleFileDownload(msg.content);
                  }}
                  href="#"
                  className={`flex items-center space-x-2 hover:underline cursor-pointer ${
                    msg.username === username
                      ? "text-blue-100"
                      : "text-blue-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="break-all">{msg.content}</span>
                </a>
              </>
            ) : (
              <>
                {msg.username !== username && (
                  <span className="text-xs font-medium text-gray-500 mb-1 block">
                    {msg.username}
                  </span>
                )}
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 mt-6">
        <input
          type="text"
          name="message"
          placeholder="Type your message..."
          onChange={(v) => handleTyping(v.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-300 ease-in-out hover:shadow-md"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md transform hover:-translate-y-1"
        >
          Send
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md transform hover:-translate-y-1"
          title="Send file"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </form>
    </div>
  );
}

const TypingAnimation = () => {
  return (
    <div className="flex gap-1 mb-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            animationDelay: `${i * 100}ms`,
          }}
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        ></div>
      ))}
    </div>
  );
};
