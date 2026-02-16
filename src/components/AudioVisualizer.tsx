import React from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
    isActive: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
    return (
        <div className="flex items-center justify-center gap-1 h-12">
            {isActive ? (
                <>
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 bg-sky-400 rounded-full"
                            animate={{
                                height: [10, 24, 10],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </>
            ) : (
                <div className="text-gray-500 text-xs font-medium animate-pulse">
                    Listening...
                </div>
            )}
        </div>
    );
};
