import { IconHexagonalPyramid } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const TypingIndicator = () => (

    <div className="flex items-start gap-3 mb-6">
        {/* AI Avatar */}
        <Avatar className="w-8 h-8 bg-primary/10">
            <AvatarFallback className="text-xs">
                <IconHexagonalPyramid size={16} className="text-primary" />
            </AvatarFallback>
        </Avatar>

        {/* Typing Animation */}
        <div className="bg-muted text-foreground px-4 py-2 rounded-2xl rounded-tl-sm">
            <div className="flex space-x-1">
                <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: '1.5s'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default TypingIndicator;