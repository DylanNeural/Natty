import React, { useState, useRef } from 'react';
import { scanImage } from '../services/api';

interface Props {
  onBack: () => void;
  onAskCoach?: (productContext?: unknown) => void;
}

export const ImageEditorScreen: React.FC<Props> = ({ onBack, onAskCoach }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const content = reader.result as string;
        setSelectedImage(content);
        const type = content.split(';')[0].split(':')[1];
        setMimeType(type);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const optimized = await downscaleImage(selectedImage, 1200);
      const base64Data = optimized.split(',')[1];
      const resp = await scanImage(base64Data, mimeType || 'image/jpeg');
      console.log('scanImage result:', resp.data);
      setResult(resp.data);
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setResult(null);
      setError(err?.message || "Erreur lors de l'analyse. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background-light dark:bg-background-dark pb-24">
      <header className="flex items-center p-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800">
        <button onClick={onBack} aria-label="Retour" className="p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-text-light dark:text-text-dark" aria-hidden="true">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-text-light dark:text-text-dark">Scanner une assiette</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Prendre une photo ou importer depuis la galerie"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[2rem] min-h-[400px] cursor-pointer active:border-primary active:bg-primary/5 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
            <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
              <span className="material-symbols-outlined text-4xl text-gray-400 group-active:text-primary" aria-hidden="true">photo_camera</span>
            </div>
            <p className="text-xl font-bold text-gray-500 group-active:text-primary relative z-10">Prendre une photo</p>
            <p className="text-sm text-gray-400 relative z-10 mt-1">ou importer depuis la galerie</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 h-full">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-black min-h-[350px] flex items-center justify-center">
              <img src={selectedImage} alt="Plat à analyser" className="w-full h-full object-cover max-h-[50vh]" />

              {result && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white/20 animate-slide-up">
                  <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">{result.nom || result.name || 'Plat analysé'}</h2>
                  {(() => {
                    const n = normalizeNutrition(result);
                    const hasValues = Object.values(n).some((v) => typeof v === 'number');
                    if (!hasValues) {
                      return <p className="text-gray-600 dark:text-gray-300">{result.description || 'Analyse terminée.'}</p>;
                    }
                    return (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <MacroItem label="Énergie" value={n.energie_kcal} suffix="kcal" color="text-primary" />
                          <MacroItem label="Protéines" value={n.proteines_g} suffix="g" color="text-warning" />
                          <MacroItem label="Glucides" value={n.glucides_g} suffix="g" color="text-accent" />
                          <MacroItem label="Lipides" value={n.lipides_g} suffix="g" color="text-secondary" />
                          <MacroItem label="Sucres" value={n.dont_sucres_g} suffix="g" color="text-primary" />
                          <MacroItem label="Sel" value={n.sel_g} suffix="g" color="text-secondary" />
                        </div>
                        <button
                          onClick={() => onAskCoach?.(result)}
                          className="mt-4 h-10 px-4 rounded-xl bg-primary text-white font-bold shadow-sm"
                        >
                          Demander au coach
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-20" role="status" aria-live="polite">
                  <div className="relative size-24">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl animate-pulse" aria-hidden="true">restaurant_menu</span>
                    </div>
                  </div>
                  <p className="text-white font-medium mt-4 animate-pulse">Analyse nutritionnelle...</p>
                </div>
              )}

              {!result && !loading && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-primary/40 active:scale-95 transition-transform flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">analytics</span>
                    Analyser ce plat
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/30" role="alert">
                <span className="material-symbols-outlined" aria-hidden="true">error</span>
                {error}
              </div>
            )}

            <button
              onClick={() => {
                setSelectedImage(null);
                setResult(null);
              }}
              className="py-3 text-sm font-bold text-gray-500 active:text-text-light transition-colors"
            >
              Changer de photo
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
        />
      </main>
    </div>
  );
};

function downscaleImage(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > width && height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      } else if (width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const MacroItem: React.FC<{ label: string; value?: number; color: string; suffix?: string }> = ({ label, value, color, suffix = 'g' }) => (
  <div className="flex flex-col items-center p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-gray-700 shadow-sm">
    <span className="text-xs text-gray-500">{label}</span>
    <span className={`text-lg font-bold ${color}`}>{value ?? '-'}{value !== undefined ? ` ${suffix}` : ''}</span>
  </div>
);

function normalizeNumber(val: any): number | undefined {
  const num = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : typeof val === 'number' ? val : NaN;
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : undefined;
}

function normalizeNutrition(raw: any) {
  const n = raw?.valeurs_nutritionnelles || raw?.nutrition || raw || {};
  return {
    energie_kcal: normalizeNumber(n.energie_kcal ?? n.energy_kcal ?? n.calories),
    proteines_g: normalizeNumber(n.proteines_g ?? n.protein ?? n.proteins ?? n['protéines']),
    glucides_g: normalizeNumber(n.glucides_g ?? n.carbs ?? n.carbohydrates ?? n.glucides),
    dont_sucres_g: normalizeNumber(n.dont_sucres_g ?? n.sucres_g ?? n.sugars ?? n.sugar),
    lipides_g: normalizeNumber(n.lipides_g ?? n.fat ?? n.fats ?? n.lipides),
    dont_satures_g: normalizeNumber(n.dont_satures_g ?? n.saturated_fat ?? n.saturates),
    fibres_g: normalizeNumber(n.fibres_g ?? n.fiber ?? n.fibres),
    sel_g: normalizeNumber(n.sel_g ?? n.salt ?? n.sodium),
  };
}
