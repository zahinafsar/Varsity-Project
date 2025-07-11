"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export function ConversationList({ username }: { username: string }) {
  const [conversations, setConversations] = useState<string[]>([]);
  const [newReceiver, setNewReceiver] = useState("");
  const router = useRouter();

  useEffect(() => {
    api
      .get(`/conversations/${username}`)
      .then((data) => {
        setConversations(data.filter((c: any) => c !== null));
      })
      .catch((err) => console.error("Error fetching conversations:", err));
  }, []);

  const handleConversationClick = (otherUser?: string) => {
    if (!otherUser) {
      router.push(`/chat`);
    } else {
      router.push(`/chat?receiver=${otherUser}`);
    }
  };

  const handleNewConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReceiver.trim()) {
      handleConversationClick(newReceiver.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Conversations
      </h1>
      <form onSubmit={handleNewConversation} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newReceiver}
            onChange={(e) => setNewReceiver(e.target.value)}
            placeholder="Enter username to start chat"
            className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out"
          >
            Start Chat
          </button>
        </div>
      </form>
      <div className="space-y-2">
        <div
          onClick={() => handleConversationClick()}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 ease-in-out"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Global Chat</h3>
          </div>
        </div>
        {conversations.map((conversation) => (
          <div
            key={conversation}
            onClick={() => handleConversationClick(conversation)}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {conversation}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
