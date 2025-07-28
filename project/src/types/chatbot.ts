export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  options?: ChatOption[];
  isLoading?: boolean;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string;
  action?: 'webhook' | 'navigate' | 'input';
  webhookUrl?: string;
  nextNodeId?: string;
}

export interface ChatNode {
  id: string;
  type: 'message' | 'options' | 'input' | 'webhook' | 'condition';
  content: string;
  options?: ChatOption[];
  webhookUrl?: string;
  nextNodeId?: string;
  conditions?: ChatCondition[];
  variables?: Record<string, any>;
}

export interface ChatCondition {
  keyword: string;
  nextNodeId: string;
  exact?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  currentNodeId: string;
  variables: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatScenario {
  id: string;
  name: string;
  startNodeId: string;
  nodes: Record<string, ChatNode>;
  language: 'ko' | 'en';
}

export interface WebhookPayload {
  sessionId: string;
  userInput?: string;
  variables: Record<string, any>;
  nodeId: string;
  action: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
  nextNodeId?: string;
  variables?: Record<string, any>;
}