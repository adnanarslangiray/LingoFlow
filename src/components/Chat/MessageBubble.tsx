import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import clsx from 'clsx';

interface MessageBubbleProps {
    text: string;
    sender: 'user' | 'ai';
    timestamp?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, timestamp }) => {
    const isUser = sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx("flex max-w-[85%] md:max-w-[75%] gap-2", isUser ? "flex-row-reverse" : "flex-row")}>

                {/* Avatar */}
                <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto",
                    isUser ? "bg-sky-500" : "bg-purple-600"
                )}>
                    {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>

                {/* Bubble */}
                <div className={clsx(
                    "p-3.5 px-5 rounded-2xl text-sm leading-relaxed shadow-md",
                    isUser
                        ? "bg-sky-500 text-white rounded-br-none"
                        : "bg-white/10 text-gray-100 rounded-bl-none border border-white/5"
                )}>
                    {text}
                    {/* Timestamp (Optional) */}
                    {timestamp && (
                        <div className={clsx("text-[10px] mt-1 opacity-50", isUser ? "text-right text-sky-100" : "text-left text-gray-400")}>
                            {timestamp}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
