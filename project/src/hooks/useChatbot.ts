'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession, ChatNode, WebhookPayload, WebhookResponse } from '../types/chatbot';
import { defaultChatScenario } from '../data/chatScenario';

const STORAGE_KEY = 'chatbot-session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useChatbot = () => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentNode, setCurrentNode] = useState<ChatNode | null>(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let newSession: ChatSession;

    if (stored) {
      try {
        const parsedSession = JSON.parse(stored);
        const sessionAge = Date.now() - new Date(parsedSession.createdAt).getTime();
        
        if (sessionAge < SESSION_DURATION) {
          newSession = {
            ...parsedSession,
            messages: parsedSession.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })),
            createdAt: new Date(parsedSession.createdAt),
            updatedAt: new Date(parsedSession.updatedAt)
          };
        } else {
          newSession = createNewSession();
        }
      } catch {
        newSession = createNewSession();
      }
    } else {
      newSession = createNewSession();
    }

    setSession(newSession);
    const node = defaultChatScenario.nodes[newSession.currentNodeId];
    setCurrentNode(node);

    // Add welcome message if it's a new session
    if (newSession.messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        type: 'bot',
        content: node.content,
        timestamp: new Date(),
        options: node.options
      };
      
      const updatedSession = {
        ...newSession,
        messages: [welcomeMessage],
        updatedAt: new Date()
      };
      
      setSession(updatedSession);
      saveSession(updatedSession);
    }
  }, []);

  const createNewSession = (): ChatSession => ({
    id: uuidv4(),
    messages: [],
    currentNodeId: defaultChatScenario.startNodeId,
    variables: {},
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const saveSession = useCallback((sessionData: ChatSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!session) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      timestamp: new Date(),
      ...message
    };

    const updatedSession = {
      ...session,
      messages: [...session.messages, newMessage],
      updatedAt: new Date()
    };

    setSession(updatedSession);
    saveSession(updatedSession);
  }, [session, saveSession]);

  const processUserInput = useCallback(async (input: string, optionValue?: string) => {
    if (!session || !currentNode) return;

    setIsLoading(true);

    // Add user message
    addMessage({
      type: 'user',
      content: input
    });

    try {
      let nextNodeId = currentNode.nextNodeId;
      let updatedVariables = { ...session.variables };

      // Handle different node types
      if (currentNode.type === 'input') {
        // Store input as variable
        updatedVariables.lastInput = input;
        
        // Check for order number pattern
        if (input.match(/^ORD\d+$/)) {
          updatedVariables.orderNumber = input;
        }
      } else if (currentNode.type === 'options' && optionValue) {
        // Handle option selection
        const selectedOption = currentNode.options?.find(opt => opt.value === optionValue);
        if (selectedOption) {
          nextNodeId = selectedOption.nextNodeId;
          
          if (selectedOption.action === 'webhook' && selectedOption.webhookUrl) {
            await handleWebhook(selectedOption.webhookUrl, updatedVariables);
          }
        }
      } else if (currentNode.type === 'condition') {
        // Handle conditional logic
        const matchedCondition = currentNode.conditions?.find(condition => {
          const keyword = condition.keyword.toLowerCase();
          const inputLower = input.toLowerCase();
          return condition.exact ? inputLower === keyword : inputLower.includes(keyword);
        });
        
        if (matchedCondition) {
          nextNodeId = matchedCondition.nextNodeId;
        }
      } else if (currentNode.type === 'webhook' && currentNode.webhookUrl) {
        await handleWebhook(currentNode.webhookUrl, updatedVariables);
      }

      // Navigate to next node
      if (nextNodeId && defaultChatScenario.nodes[nextNodeId]) {
        const nextNode = defaultChatScenario.nodes[nextNodeId];
        
        // Update session with new variables and current node
        const updatedSession = {
          ...session,
          currentNodeId: nextNodeId,
          variables: updatedVariables,
          updatedAt: new Date()
        };
        
        setSession(updatedSession);
        setCurrentNode(nextNode);
        saveSession(updatedSession);

        // Add bot response after a short delay
        setTimeout(() => {
          let responseContent = nextNode.content;
          
          // Replace variables in content
          Object.entries(updatedVariables).forEach(([key, value]) => {
            responseContent = responseContent.replace(`{{${key}}}`, String(value));
          });

          addMessage({
            type: 'bot',
            content: responseContent,
            options: nextNode.options
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error processing user input:', error);
      addMessage({
        type: 'bot',
        content: '죄송합니다. 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, currentNode, addMessage, saveSession]);

  const handleWebhook = async (webhookUrl: string, variables: Record<string, any>) => {
    try {
      const payload: WebhookPayload = {
        sessionId: session?.id || '',
        variables,
        nodeId: currentNode?.id || '',
        action: 'webhook_call',
        userInput: variables.lastInput
      };

      // In a real implementation, this would call your n8n webhook
      // For demo purposes, we'll simulate the response
      const mockResponse: WebhookResponse = {
        success: true,
        message: '주문 정보를 조회했습니다.',
        data: {
          orderNumber: variables.orderNumber || 'ORD20241201001',
          status: '배송 준비중',
          deliveryDate: '2024-12-03',
          trackingNumber: 'TRK123456789'
        }
      };

      // Update variables with webhook response
      if (mockResponse.success && mockResponse.data) {
        Object.assign(variables, mockResponse.data);
      }

    } catch (error) {
      console.error('Webhook error:', error);
      addMessage({
        type: 'bot',
        content: '외부 시스템 연동 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    }
  };

  const resetSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    initializeSession();
  }, [initializeSession]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const newSession = createNewSession();
    setSession(newSession);
    setCurrentNode(defaultChatScenario.nodes[newSession.currentNodeId]);
  }, []);

  return {
    session,
    currentNode,
    isLoading,
    processUserInput,
    resetSession,
    clearHistory,
    addMessage
  };
};