import React from 'react';
import { Mic, Settings } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-gray-950 text-white flex flex-col items-center justify-start relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-sky-500/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow mix-blend-screen" />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-purple-500/20 rounded-full blur-[100px] opacity-30 animate-pulse-slow mix-blend-screen delay-1000" />
            </div>

            {/* Main Container */}
            <div className="w-full max-w-md h-screen flex flex-col relative z-10 flex-grow shadow-2xl bg-gray-900/80 backdrop-blur-xl border-x border-white/5">

                {/* Header */}
                <header className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-bold text-lg tracking-tight leading-none text-white">SpeakAI</h1>
                            <span className="text-xs text-sky-400 font-medium tracking-wide">Language Companion</span>
                        </div>
                    </div>
                    <button
                        className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white active:scale-95 duration-200"
                        aria-label="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto w-full relative flex flex-col">
                    {children}
                </main>

            </div>
        </div>
    );
};
