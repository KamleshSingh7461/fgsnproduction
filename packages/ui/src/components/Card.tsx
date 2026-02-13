import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'glass' | 'solid' | 'outline';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'glass' }) => {
    const baseStyles = "rounded-xl p-6 transition-all";

    const variants = {
        glass: "bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-xl", // The signature look
        solid: "bg-zinc-900 border border-zinc-800",
        outline: "bg-transparent border border-white/10"
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};
