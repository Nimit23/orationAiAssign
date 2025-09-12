'use client';

import React, { useState } from 'react';
import SessionList from './SessionList';
import ChatInterface from './ChatInterface';
import { type ChatSession } from '@/generated/prisma';

export default function ChatPage() {
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null,
  );

  return (
    <div className="flex w-full">
      <div className="w-1/4 border-r">
        <SessionList
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
        />
      </div>
      <div className="w-3/4">
        <ChatInterface selectedSession={selectedSession} />
      </div>
    </div>
  );
}
