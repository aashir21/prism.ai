"use client"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { SendHorizonal } from "lucide-react"
import { SiteHeader } from "../site-header"
import { IconHexagonalPyramid } from "@tabler/icons-react"
import { useState, useRef } from "react"
import AIResponseView from "./AIResponseView"
import LoadingScreen from "./LoadingScreen"
import ChatScreen from "./ChatScreen"
import { chatWithAI, generateExplanation } from "@/lib/ai"
import { ProblemExplanation } from "@/types"

// Types for our chat system
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export interface ChatState {
    messages: Message[];
    isTyping: boolean;
    problemStatement: string;
}

export default function DashboardPage() {
    const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [snapPoint, setSnapPoint] = useState<string>("w-full");
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isTyping: false,
        problemStatement: "",
    });
    const [explanation, setExplanation] = useState<ProblemExplanation>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Function to add a new message
    const addMessage = (content: string, sender: 'user' | 'ai'): void => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender,
            timestamp: new Date()
        };

        setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
        }));
    };

    // Function to handle sending a message
    const handleSendMessage = async (): Promise<void> => {
        if (!currentMessage.trim()) return;

        const userMessage = currentMessage.trim();
        setCurrentMessage("");

        // Add user message
        addMessage(userMessage, 'user');

        // Set AI typing state
        setChatState(prev => ({ ...prev, isTyping: true }));

        try {
            // Generate AI response
            const aiResponse = await chatWithAI(chatState.problemStatement, chatState.messages.slice(0, 10).toString(), userMessage);

            // Add AI response
            addMessage(aiResponse, 'ai');
        } catch (error) {
            // Handle error
            addMessage("I apologize, but I encountered an error. Please try again.", 'ai');
        } finally {
            // Remove typing state
            setChatState(prev => ({ ...prev, isTyping: false }));
        }
    };

    // Helper function to parse explanation JSON safely
    function parseExplanationJSON(explanation: string): ProblemExplanation | null {
        try {
            // Remove markdown code blocks if they exist
            let cleanedResponse = explanation
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();

            // Try to extract JSON object if it's embedded in text
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanedResponse = jsonMatch[0];
            }

            return JSON.parse(cleanedResponse);
        } catch (error) {
            console.error('Failed to parse explanation JSON:', error);
            console.error('Raw explanation text:', explanation);
            return null;
        }
    }

    // Alternative approach using setTimeout if you prefer callbacks
    const startChat = async (): Promise<void> => {
        if (!isChatStarted && currentMessage.trim()) {
            // Start loading state
            setIsLoading(true);
            setSnapPoint("w-full lg:w-1/2");
            setChatState({ ...chatState, problemStatement: currentMessage })

            const content = await generateExplanation(currentMessage);
            const parsedExplanation: ProblemExplanation | null = parseExplanationJSON(content);
            setExplanation(parsedExplanation!);

            setIsLoading(false);
            setIsChatStarted(true);
            setCurrentMessage("");
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isChatStarted) {
                handleSendMessage();
            } else {
                startChat();
            }
        }
    };

    return (
        <div className="min-h-[95vh] bg-card rounded-lg flex flex-col lg:flex-row lg:items-center overflow-hidden">
            {/* Main Canvas Area - with smooth transitions */}
            <div className={`
                ${isChatStarted ? 'h-[50vh] lg:h-[95vh]' : 'h-[95vh]'}
                ${snapPoint} 
                transition-all duration-700 ease-in-out
                flex flex-col
                relative
                ${isLoading || isChatStarted ? 'lg:border-r border-b lg:border-b-0 border-border' : ''}
            `}>
                <SiteHeader />

                {/* Canvas Background Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            radial-gradient(circle at 20px 20px, currentColor 1px, transparent 0),
                            radial-gradient(circle at 60px 60px, currentColor 0.5px, transparent 0)
                        `,
                        backgroundSize: '80px 80px'
                    }}></div>
                </div>

                {/* Content Area - Conditional Layout */}
                {isChatStarted ? (
                    // Chat Layout - Full height with sticky input
                    <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                        {/* Chat Messages - Scrollable Area */}
                        <div className="flex-1 overflow-hidden">
                            <ChatScreen
                                messages={chatState.messages}
                                isTyping={chatState.isTyping}
                            />
                        </div>

                        {/* Input Area - Sticky Bottom */}
                        <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder="Type your message..."
                                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 resize-y w-full"
                                    disabled={isLoading || chatState.isTyping}
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows={2}
                                />
                                <Button
                                    className={`
                                        cursor-pointer transition-all duration-300 w-full sm:w-auto
                                        ${(isLoading || chatState.isTyping || !currentMessage.trim()) && 'opacity-50 cursor-not-allowed'}
                                    `}
                                    onClick={handleSendMessage}
                                    disabled={isLoading || chatState.isTyping || !currentMessage.trim()}
                                >
                                    {chatState.isTyping ? 'Answering...' : 'Send'}
                                    <SendHorizonal className={`ml-1 ${chatState.isTyping ? 'animate-pulse' : ''}`} />
                                </Button>
                            </div>
                            <p className="mt-2 text-muted-foreground text-xs animate-fade-in text-center sm:text-left">
                                Press Enter to send • Refresh page to start a new chat
                            </p>
                        </div>
                    </div>
                ) : (
                    // Welcome Screen Layout - Centered with absolute input
                    <>
                        {/* Content Area - Flex layout to prevent overlap */}
                        <div className="flex-1 flex flex-col justify-between p-4 relative z-20 pb-0">
                            {/* Center Content */}
                            <div className="flex-1 flex items-center justify-center">
                                {!isLoading ? (
                                    <div className="flex flex-col w-full items-center justify-center transition-all duration-500 ease-in-out">
                                        <div className="transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                                            <IconHexagonalPyramid color="#a3e635" size={64} />
                                        </div>
                                        <h1 className="font-semibold text-2xl text-center mt-4 transition-all duration-300">
                                            Prism AI
                                        </h1>
                                        <p className="text-center w-full lg:w-2/3 xl:w-1/2 p-2 text-muted-foreground transition-all duration-300">
                                            Get started with pasting a problem statement. Prism will dissect the problem, so you can understand better
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full items-center justify-center">
                                        <div className="relative mb-6">
                                            {/* Animated Prism Icon */}
                                            <div className="animate-pulse">
                                                <IconHexagonalPyramid color="#a3e635" size={64} />
                                            </div>
                                            {/* Rotating border effect */}
                                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-spin"
                                                style={{ animationDuration: '3s' }}></div>
                                        </div>

                                        <h2 className="font-semibold text-xl text-center mb-2">
                                            Initializing Prism AI...
                                        </h2>
                                        <p className="text-center text-muted-foreground text-sm mb-4">
                                            Preparing your intelligent workspace
                                        </p>

                                        {/* Progress dots */}
                                        <div className="flex space-x-2">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 h-2 bg-primary rounded-full animate-pulse"
                                                    style={{
                                                        animationDelay: `${i * 0.3}s`,
                                                        animationDuration: '1.5s'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Welcome Screen Input - Bottom positioning with proper spacing */}
                            <div className="w-full p-4 mt-4">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Paste a leetcode problem with constraints..."
                                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 w-full"
                                        disabled={isLoading}
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        rows={3}
                                    />
                                    <Button
                                        className={`
                                            cursor-pointer transition-all duration-300 w-full sm:w-auto
                                            ${(isLoading || !currentMessage.trim()) && 'opacity-50 cursor-not-allowed'}
                                        `}
                                        onClick={startChat}
                                        disabled={isLoading || !currentMessage.trim()}
                                    >
                                        {isLoading ? 'Starting...' : 'Chat'}
                                        <SendHorizonal className={`ml-1 ${isLoading ? 'animate-pulse' : ''}`} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Loading Screen - slides in from right on desktop, from bottom on mobile */}
            <div className={`
                ${isLoading && !isChatStarted
                    ? 'w-full h-[75vh] lg:w-1/2 lg:h-[95vh] translate-x-0 translate-y-0'
                    : 'w-0 h-0 lg:w-0 lg:h-full translate-x-full lg:translate-x-full translate-y-full lg:translate-y-0'
                } 
                transition-all duration-700 ease-in-out
                overflow-hidden
                flex flex-col
            `}>
                {isLoading && (
                    <div className="w-full h-full">
                        <LoadingScreen />
                    </div>
                )}
            </div>

            {/* AI Response View - slides in from right on desktop, from bottom on mobile */}
            <div className={`
                ${isChatStarted
                    ? 'w-full h-[75vh] lg:w-1/2 lg:h-[95vh] translate-x-0 translate-y-0'
                    : 'w-0 h-0 lg:w-0 lg:h-full translate-x-full lg:translate-x-full translate-y-full lg:translate-y-0'
                } 
                transition-all duration-700 ease-in-out
                overflow-hidden
                flex flex-col
                order-last lg:order-none
            `}>
                {isChatStarted && (
                    <div className="w-full h-full overflow-hidden">
                        <AIResponseView explanation={explanation!} />
                    </div>
                )}
            </div>
        </div>
    )
}