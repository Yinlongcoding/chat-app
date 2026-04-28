import React from 'react';

interface MobilePageStackProps {
  activeIndex: number;
  durationMs?: number;
  easing?: string;
  parallaxOffset?: number;
  pages: Array<{
    key: string;
    content: React.ReactNode;
    backgroundColor?: string;
    className?: string;
  }>;
}

const DEFAULT_EASING = 'cubic-bezier(0.22, 0.72, 0, 1)';

export const MobilePageStack: React.FC<MobilePageStackProps> = ({
  activeIndex,
  durationMs = 420,
  easing = DEFAULT_EASING,
  parallaxOffset = 18,
  pages,
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden isolate">
      {pages.map((page, index) => {
        const distance = index - activeIndex;
        const offset = distance < 0 ? -parallaxOffset : distance * 100;
        const isActive = index === activeIndex;
        const isBehind = index < activeIndex;

        return (
          <div
            key={page.key}
            className={`absolute inset-0 ${page.className || ''}`}
            style={{
              transform: `translateX(${offset}%)`,
              transition: `transform ${durationMs}ms ${easing}, opacity ${durationMs}ms ${easing}, box-shadow ${durationMs}ms ${easing}`,
              backgroundColor: page.backgroundColor,
              boxShadow: isActive && activeIndex > 0 ? '-18px 0 40px rgba(0,0,0,0.22)' : 'none',
              opacity: isBehind ? 0.96 : 1,
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: index,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          >
            {page.content}
          </div>
        );
      })}
    </div>
  );
};
