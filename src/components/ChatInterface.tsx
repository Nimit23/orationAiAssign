'use client';

import React, { useState } from 'react';
import { type ChatSession } from '@/generated/prisma';
import { trpc } from '@/lib/trpc';

interface ChatInterfaceProps {
  selectedSession: ChatSession | null;
}

export default function ChatInterface({
  selectedSession,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = trpc.chat.getMessages.useQuery(
    { sessionId: selectedSession?.id || 0 },
    { enabled: !!selectedSession },
  );
  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
      setMessage('');
    },
  });

  if (!selectedSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Select a session to start chatting.</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    sendMessage.mutate({
      sessionId: selectedSession.id,
      content: message,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading && <p>Loading messages...</p>}
        {isError && <p>Error loading messages.</p>}
        {messages?.map((msg) => (
          <div key={msg.id} className="mb-4">
            <p className="font-bold">{msg.role}</p>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
