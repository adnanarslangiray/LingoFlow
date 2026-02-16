import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../Layout';
import { MessageBubble } from './MessageBubble';
import { AudioVisualizer } from '../AudioVisualizer';
import { useAudio } from '../../context/AudioContext';
import { getAIResponse } from '../../services/ai';
import { Send, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export const ChatInterface: React.FC = () => {
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        speak
    } = useAudio();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your AI language companion. Click the microphone to start speaking.",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle voice transcript
    useEffect(() => {
        if (transcript) {
            handleSendMessage(transcript);
            resetTranscript();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcript]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsProcessing(true);

        try {
            const responseText = await getAIResponse(text);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMessage]);
            speak(responseText);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <Layout>
            <div className="flex flex-col h-full">
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-24">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                text={msg.text}
                                sender={msg.sender}
                                timestamp={msg.timestamp}
                            />
                        ))}
                    </AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-gray-500 text-sm ml-2"
                        >
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-2 flex items-center gap-2 shadow-xl">

                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                            placeholder="Type or speak..."
                            className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-gray-400 font-medium"
                            disabled={isProcessing}
                        />

                        {inputText.trim() ? (
                            <button
                                onClick={() => handleSendMessage(inputText)}
                                className="p-3 bg-sky-500 rounded-full text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={toggleListening}
                                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${isListening
                                        ? 'bg-red-500 text-white shadow-red-500/20 animate-pulse'
                                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/20 hover:scale-105'
                                    }`}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        )}
                    </div>

                    {/* Visualizer Helper */}
                    <div className="h-8 flex justify-center mt-2">
                        <AudioVisualizer isActive={isListening} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};
