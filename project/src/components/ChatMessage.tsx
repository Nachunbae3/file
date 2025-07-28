'use client';

import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChatMessage as ChatMessageType, ChatOption } from '../types/chatbot';
import { User, Bot, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect?: (option: ChatOption) => void;
  isLatest?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onOptionSelect,
  isLatest = false
}) => {
  const isBot = message.type === 'bot';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={clsx(
      'flex gap-3 mb-4 chat-message',
      !isBot && 'flex-row-reverse'
    )}>
      {/* Avatar */}
      <div className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isBot ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
      )}>
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Message Content */}
      <div className={clsx(
        'flex-1 max-w-[80%]',
        !isBot && 'flex flex-col items-end'
      )}>
        {/* Message Bubble */}
        <div className={clsx(
          'px-4 py-3 rounded-lg shadow-sm text-sm leading-relaxed',
          isBot 
            ? 'bg-white border border-gray-200 text-gray-800' 
            : 'bg-blue-500 text-white'
        )}>
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>입력 중...</span>
            </div>
          ) : (
            <div className="whitespace-pre-line">
              {message.content}
            </div>
          )}
        </div>

        {/* Options */}
        {message.options && message.options.length > 0 && isLatest && !message.isLoading && (
          <div className="mt-3 space-y-2 w-full">
            {message.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onOptionSelect?.(option)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors duration-200 hover:shadow-sm"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={clsx(
          'text-xs text-gray-500 mt-1',
          !isBot && 'text-right'
        )}>
          {format(message.timestamp, 'HH:mm', { locale: ko })}
        </div>
      </div>
    </div>
  );
};