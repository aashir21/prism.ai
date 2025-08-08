import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { IconHexagonalPyramid } from '@tabler/icons-react';
import MessageBubble from '../MessageBubble';
import TypingIndicator from '../TypingIndicator';

// Import the Message interface from the dashboard
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatScreenProps {
    messages: Message[];
    isTyping?: boolean;
}


const ChatScreen: React.FC<ChatScreenProps> = ({ messages, isTyping = false }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isTyping]);

    return (
        <div className="h-full flex flex-col w-full overflow-y-auto [&::-webkit-scrollbar]:w-[0px] relative">
            {/* Messages Area */}
            <ScrollArea
                ref={scrollAreaRef}
                className="flex-1 p-4"
            >
                <div className="space-y-0">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <IconHexagonalPyramid
                                size={48}
                                className="text-primary/30 mb-4"
                            />
                            <h3 className="font-medium text-muted-foreground">
                                Start your conversation
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Ask follow up questions
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}
                            {isTyping && <TypingIndicator />}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatScreen;