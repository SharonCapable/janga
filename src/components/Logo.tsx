import React from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export default function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 bg-transparent p-0 ${className}`}>
            <div style={{ width: size, height: size, position: 'relative' }} className="drop-shadow-2xl">
                <Image
                    src="/logo.png"
                    alt="Janga Logo"
                    fill
                    sizes={`${size}px`}
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>
            {showText && (
                <span className="font-black uppercase tracking-tighter" style={{
                    fontSize: size * 0.7,
                    color: '#60a5fa',
                    textShadow: '0 0 20px rgba(59,130,246,0.3)'
                }}>
                    JANGA
                </span>
            )}
        </div>
    );
}
