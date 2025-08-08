// types/chat.ts
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export interface ChatState {
    messages: Message[];
    isTyping: boolean;
}

export interface ChatScreenProps {
    messages: Message[];
    isTyping?: boolean;
}

export interface MessageBubbleProps {
    message: Message;
}

export interface AIResponse {
    success: boolean;
    content: string;
    error?: string;
}

// For future API integration
export interface ChatAPIRequest {
    message: string;
    conversationId?: string;
    context?: string[];
}

export interface ChatAPIResponse {
    response: string;
    conversationId: string;
    timestamp: string;
    tokens_used?: number;
}

export interface ProblemExplanation {
    explanation: string;
    pattern: string[];
    hints: string[];
    steps: string[];
    solutions: Solution[]
}

interface Solution {
    language: string;
    code: string;
}