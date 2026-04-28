import React from 'react';

interface MobilePageStackProps {
  activeIndex: number;
  pages: Array<{
    key: string;
    content: React.ReactNode;
    backgroundColor?: string;
    className?: string;
  }>;
}

export const MobilePageStack: React.FC<MobilePageStackProps> = ({ activeIndex, pages }) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {pages.map((page, index) => {
        const offset = (index - activeIndex) * 100;
        const isActive = index === activeIndex;

        return (
          <div
            key={page.key}
            className={`absolute inset-0 transition-transform duration-300 ease-out ${page.className || ''}`}
            style={{
              transform: `translateX(${offset}%)`,
              backgroundColor: page.backgroundColor,
              boxShadow: isActive && activeIndex > 0 ? '-12px 0 32px rgba(0,0,0,0.24)' : 'none',
            }}
          >
            {page.content}
          </div>
        );
      })}
    </div>
  );
};
