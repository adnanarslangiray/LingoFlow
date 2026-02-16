import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string, lang?: string) => void;
    stopSpeaking: () => void;
    language: string;
    setLanguage: (lang: string) => void;
    recognitionCheck: boolean;
    resetTranscript: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [language, setLanguage] = useState('en-US'); // Default to English
    const [recognitionCheck, setRecognitionCheck] = useState(true);

    const resetTranscript = () => setTranscript('');

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Keep listening
            recognitionRef.current.interimResults = true; // Show partial results
            recognitionRef.current.lang = language;

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(event.results[i][0].transcript);
                        // Here we would typically trigger the AI response
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

        } else {
            console.warn('Speech Recognition API not supported in this browser.');
            setRecognitionCheck(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const speak = (text: string, lang: string = language) => {
        if (synthRef.current.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text !== '') {
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.onend = () => setIsSpeaking(false);
            utterThis.onerror = (error) => console.error('Speech Synthesis Error:', error);

            utterThis.lang = lang;
            // Optional: Select a specific voice based on language
            // const voices = synthRef.current.getVoices();
            // utterThis.voice = voices.find(...)

            setIsSpeaking(true);
            synthRef.current.speak(utterThis);
        }
    };

    const stopSpeaking = () => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <AudioContext.Provider value={{
            isListening,
            isSpeaking,
            transcript,
            startListening,
            stopListening,
            speak,
            stopSpeaking,
            language,
            setLanguage,
            recognitionCheck,
            resetTranscript
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
