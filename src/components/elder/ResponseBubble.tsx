'use client';

import type { ChatMessage } from '@/types';

interface ResponseBubbleProps {
  message: ChatMessage;
}

export function ResponseBubble({ message }: ResponseBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 text-lg ${
          isUser
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-white text-gray-800 shadow-sm rounded-bl-md border'
        }`}
      >
        {!isUser && <div className="text-xs text-gray-400 mb-1">🧸 小棉袄</div>}
        <p className="leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
