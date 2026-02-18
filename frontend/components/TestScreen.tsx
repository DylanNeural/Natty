import React from "react";

interface Props {
  onBack: () => void;
}

export const TestScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6 bg-background-light dark:bg-background-dark">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          Page de test
        </h1>
        <p className="mt-2 text-sm text-text-light/70 dark:text-text-dark/70">
          Acces sans connexion. Supprimable avant la prod.
        </p>
      </div>

      <button
        onClick={onBack}
        className="rounded-full px-6 py-3 bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform duration-200"
      >
        Retour
      </button>
    </div>
  );
};
