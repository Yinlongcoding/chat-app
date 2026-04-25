import React from 'react';
import { getInitials } from '../data/mockData';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  src?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md', online, src }) => {
  return (
    <div className="relative flex-shrink-0">
      {/* Subtle glow ring */}
      <div
        className="absolute -inset-0.5 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}44, ${color}22)`,
          filter: 'blur(3px)',
        }}
      />
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white select-none transition-transform duration-200`}
        style={{
          backgroundColor: color,
          boxShadow: `0 2px 8px ${color}33`,
        }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {online !== undefined && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: online ? '#34D399' : '#6B6580',
            border: '2px solid',
            borderColor: online ? 'transparent' : 'rgba(107, 101, 128, 0.3)',
            boxShadow: online ? '0 0 6px rgba(52, 211, 153, 0.5)' : 'none',
          }}
        />
      )}
    </div>
  );
};
