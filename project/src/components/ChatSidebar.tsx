'use client';

import React, { useEffect, useRef } from 'react';
import { X, MessageCircle, RotateCcw, Trash2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChatbot } from '../hooks/useChatbot';
import { ChatOption } from '../types/chatbot';
import clsx from 'clsx';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  isMobile = false
}) => {
  const {
    session,
    currentNode,
    isLoading,
    processUserInput,
    resetSession,
    clearHistory
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);

  const handleSendMessage = async (message: string) => {
    await processUserInput(message);
  };

  const handleOptionSelect = async (option: ChatOption) => {
    await processUserInput(option.label, option.value);
  };

  const handleReset = () => {
    resetSession();
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  if (!session) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed right-0 top-0 h-full bg-white shadow-xl z-50 flex flex-col',
        'transition-transform duration-300 ease-in-out',
        isMobile 
          ? 'w-full' 
          : 'w-[40%] min-w-[400px] max-w-[600px]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
          <div className="flex items-center gap-3">
            <MessageCircle size={24} />
            <div>
              <h2 className="font-semibold text-lg">고객센터 챗봇</h2>
              <p className="text-blue-100 text-sm">24시간 상담 서비스</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              title="대화 다시 시작"
              aria-label="대화 다시 시작"
            >
              <RotateCcw size={18} />
            </button>
            
            {/* Clear History Button */}
            <button
              onClick={handleClearHistory}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              title="대화 기록 삭제"
              aria-label="대화 기록 삭제"
            >
              <Trash2 size={18} />
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              aria-label="챗봇 닫기"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50 chat-scrollbar"
        >
          <div className="space-y-1">
            {session.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelect={handleOptionSelect}
                isLatest={index === session.messages.length - 1}
              />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <ChatMessage
                message={{
                  id: 'loading',
                  type: 'bot',
                  content: '',
                  timestamp: new Date(),
                  isLoading: true
                }}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || currentNode?.type === 'options'}
          placeholder={
            currentNode?.type === 'input' 
              ? currentNode.content 
              : currentNode?.type === 'options'
              ? '위 옵션 중 선택해주세요'
              : '메시지를 입력하세요...'
          }
          isLoading={isLoading}
        />

        {/* Footer */}
        <div className="p-3 bg-gray-100 border-t text-center">
          <p className="text-xs text-gray-500">
            Powered by n8n Automation • 안전한 대화 보장
          </p>
        </div>
      </div>
    </>
  );
};