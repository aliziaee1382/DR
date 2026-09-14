import React from 'react';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const imageSizes = {
    sm: 'h-9 sm:h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20'
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src="/logo.png" 
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/picture/logo.png';
        }}
        alt="پزشک آنلاین" 
        className={`${imageSizes[size]} w-auto object-contain max-h-full`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

