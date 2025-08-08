import { MessageBubbleProps } from "@/types";
import { IconHexagonalPyramid, IconUser } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isAI = message.sender === 'ai';

    return (
        <div className={`flex items-start gap-3 mb-6 ${isAI ? '' : 'flex-row-reverse'}`}>
            {/* Avatar */}
            <Avatar className={`w-8 h-8 ${isAI ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                <AvatarFallback className="text-xs">
                    {isAI ? (
                        <IconHexagonalPyramid size={16} className="text-primary" />
                    ) : (
                        <IconUser size={16} className="text-muted-foreground" />
                    )}
                </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} w-full mb-4`}>
                <div
                    className={`
            px-4 py-3 rounded-2xl text-sm max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]
            ${isAI
                            ? 'bg-muted text-foreground rounded-tl-sm'
                            : 'bg-primary text-primary-foreground rounded-tr-sm'
                        }
            animate-fade-in shadow-sm
            break-words overflow-hidden
        `}
                >
                    <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed">
                        {/* Handle code blocks and inline code */}
                        {message.content.includes('```') ? (
                            <div className="space-y-2">
                                {message.content.split(/(```[\s\S]*?```)/g).map((part, index) => {
                                    if (part.startsWith('```') && part.endsWith('```')) {
                                        // Code block
                                        const code = part.slice(3, -3).trim();
                                        const lines = code.split('\n');
                                        const language = lines[0].match(/^[a-zA-Z]+$/) ? lines.shift() : '';
                                        const codeContent = lines.join('\n');

                                        return (
                                            <div key={index} className="my-2">
                                                {language && (
                                                    <div className="text-xs text-muted-foreground mb-1 font-mono">
                                                        {language}
                                                    </div>
                                                )}
                                                <div className={`
                                        rounded-lg p-3 font-mono text-xs
                                        ${isAI
                                                        ? 'bg-background border border-border'
                                                        : 'bg-primary-foreground/10 border border-primary-foreground/20'
                                                    }
                                        overflow-x-auto
                                    `}>
                                                    <pre className="whitespace-pre-wrap break-all">
                                                        {codeContent}
                                                    </pre>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Regular text with inline code handling
                                        return (
                                            <span key={index}>
                                                {part.split(/(`[^`]+`)/g).map((subPart, subIndex) => {
                                                    if (subPart.startsWith('`') && subPart.endsWith('`')) {
                                                        // Inline code
                                                        return (
                                                            <code
                                                                key={subIndex}
                                                                className={`
                                                        px-1.5 py-0.5 rounded text-xs font-mono
                                                        ${isAI
                                                                        ? 'bg-background border border-border'
                                                                        : 'bg-primary-foreground/20'
                                                                    }
                                                        break-all
                                                    `}
                                                            >
                                                                {subPart.slice(1, -1)}
                                                            </code>
                                                        );
                                                    }
                                                    return subPart;
                                                })}
                                            </span>
                                        );
                                    }
                                })}
                            </div>
                        ) : (
                            // Regular text with inline code handling
                            <div>
                                {message.content.split(/(`[^`]+`)/g).map((part, index) => {
                                    if (part.startsWith('`') && part.endsWith('`')) {
                                        // Inline code
                                        return (
                                            <code
                                                key={index}
                                                className={`
                                        px-1.5 py-0.5 rounded text-xs font-mono
                                        ${isAI
                                                        ? 'bg-background border border-border'
                                                        : 'bg-primary-foreground/20'
                                                    }
                                        break-all
                                    `}
                                            >
                                                {part.slice(1, -1)}
                                            </code>
                                        );
                                    }
                                    return part;
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Optional: Add timestamp */}
                <div className={`
        text-xs text-muted-foreground mt-1 px-2
        ${isAI ? 'text-left' : 'text-right'}
    `}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;