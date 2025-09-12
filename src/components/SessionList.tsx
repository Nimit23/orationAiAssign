'use client';

import React from 'react';
import { type ChatSession } from '@/generated/prisma';
import { trpc } from '@/lib/trpc';

interface SessionListProps {
  selectedSession: ChatSession | null;
  setSelectedSession: (session: ChatSession) => void;
}

export default function SessionList({
  selectedSession,
  setSelectedSession,
}: SessionListProps) {
  const {
    data: sessions,
    isLoading,
    isError,
    refetch,
  } = trpc.chat.getSessions.useQuery();
  const createSession = trpc.chat.createSession.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) {
    return <p>Loading sessions...</p>;
  }

  if (isError) {
    return <p>Error loading sessions.</p>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <button
          className="w-full p-2 bg-blue-500 text-white rounded"
          onClick={() => createSession.mutate()}
        >
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sessions?.map((session) => (
          <div
            key={session.id}
            className={`p-4 cursor-pointer ${
              selectedSession?.id === session.id ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedSession(session)}
          >
            <p>{session.topic || `Session ${session.id}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
