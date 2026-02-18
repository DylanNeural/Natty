import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="h-full w-full bg-primary flex flex-col items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-accent tracking-tight text-7xl font-bold leading-tight animate-bounce">Natty</h1>
        <p className="text-accent/90 text-xl font-normal leading-normal pt-2">The Starbucks of Sport.</p>
      </div>
    </div>
  );
};