import React from 'react';

interface Props {
  onNavigate: () => void;
  onTestNavigate?: () => void;
}

export const LandingScreen: React.FC<Props> = ({ onNavigate, onTestNavigate }) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between p-4 bg-background-dark overflow-hidden">
      {/* Background Image - Sexy & Energetic */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 animate-slow-pan"
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
      </div>

      <main className="z-10 flex w-full flex-1 flex-col items-center justify-end pb-16 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-8 shadow-2xl border border-white/10 ring-1 ring-white/20">
              <span className="material-symbols-outlined !text-6xl text-accent">fitness_center</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter text-white mb-2 drop-shadow-xl">Natty</h1>
          <p className="text-white/80 text-xl font-light tracking-wide">
            The Starbucks of Sport.
          </p>
        </div>
      </main>

      <footer className="z-10 w-full p-6 pb-10">
        <button 
          onClick={onNavigate}
          className="group relative w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 px-5 bg-warning text-white text-xl font-bold leading-normal tracking-wide shadow-[0_0_40px_rgba(233,116,7,0.4)] active:scale-95 transition-transform duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-warning to-yellow-500"></div>
          <span className="relative z-10 flex items-center gap-2">
            Get Started 
            <span className="material-symbols-outlined">arrow_forward</span>
          </span>
        </button>

        {onTestNavigate && (
          <button
            onClick={onTestNavigate}
            className="mt-4 w-full rounded-full h-12 border border-white/20 text-white/90 text-sm font-semibold tracking-wide bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            Page de test (temporaire)
          </button>
        )}
      </footer>
    </div>
  );
};