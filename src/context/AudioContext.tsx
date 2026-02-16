import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string) => void;
    stopSpeaking: () => void;
    language: string;
    setLanguage: (lang: string) => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    voiceURI: string;
    setVoiceURI: (uri: string) => void;
    recognitionCheck: boolean;
    resetTranscript: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load initial state from localStorage
    const [apiKey, setApiKey] = useState(localStorage.getItem('speakai_apikey') || '');
    const [language, setLanguage] = useState(localStorage.getItem('speakai_language') || 'en-US');
    const [voiceURI, setVoiceURI] = useState(localStorage.getItem('speakai_voice') || '');

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognitionCheck, setRecognitionCheck] = useState(true);

    const resetTranscript = () => setTranscript('');

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

    // Persist settings
    useEffect(() => {
        localStorage.setItem('speakai_apikey', apiKey);
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('speakai_language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('speakai_voice', voiceURI);
    }, [voiceURI]);

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
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const speak = (text: string) => {
        if (synthRef.current.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text !== '') {
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.onend = () => setIsSpeaking(false);
            utterThis.onerror = (error) => console.error('Speech Synthesis Error:', error);

            utterThis.lang = language;

            // Set preferred voice if available
            if (voiceURI) {
                const voices = synthRef.current.getVoices();
                const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
                if (selectedVoice) {
                    utterThis.voice = selectedVoice;
                }
            }

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
            apiKey,
            setApiKey,
            voiceURI,
            setVoiceURI,
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
