'use client';

import React, { memo } from 'react';

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(({ children, className = '', colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'], speed = 1 }: AuroraTextProps) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animationDuration: `${10 / speed}s`
  };

  const text = String(children);
  const characters = text.split('');

  return (
    <span className={`relative inline-flex flex-col items-center ${className}`}>
      <span className="sr-only">{children}</span>
      {characters.map((char, index) => (
        <span key={index} className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent" style={gradientStyle} aria-hidden="true">
          {char}
        </span>
      ))}
    </span>
  );
});

AuroraText.displayName = 'AuroraText';
