import React from 'react';

interface LogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export default function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: size, height: size, position: 'relative' }}>
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(0 0 12px hsla(210, 100%, 60%, 0.4))' }}
                >
                    <defs>
                        <linearGradient id="janga-grad-v2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="60%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                        <filter id="glow-logo" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Abstract Play Button / J Combo */}
                    <path
                        d="M35 25C35 25 35 15 50 15C65 15 65 25 65 25V65C65 76.0457 56.0457 85 45 85C33.9543 85 25 76.0457 25 65"
                        stroke="url(#janga-grad-v2)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    <path
                        d="M50 35L75 50L50 65V35Z"
                        fill="url(#janga-grad-v2)"
                        style={{ filter: 'url(#glow-logo)' }}
                    />

                    {/* AI Sparkle */}
                    <path
                        d="M80 20L82 25L87 27L82 29L80 34L78 29L73 27L78 25L80 20Z"
                        fill="white"
                    >
                        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
            {showText && (
                <span style={{
                    fontSize: size * 0.7,
                    fontWeight: '900',
                    letterSpacing: '-0.06em',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase'
                }}>
                    JANGA
                </span>
            )}
        </div>
    );
}
