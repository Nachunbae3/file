'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatSidebar } from './ChatSidebar';
import clsx from 'clsx';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={clsx(
          'fixed bottom-6 right-6 z-40',
          'w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white',
          'rounded-full shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-300 ease-in-out',
          'focus:outline-none focus:ring-4 focus:ring-blue-200',
          isOpen && 'scale-0 opacity-0'
        )}
        aria-label="채팅 상담 열기"
      >
        <MessageCircle size={24} />
        
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">1</span>
        </div>
      </button>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
};