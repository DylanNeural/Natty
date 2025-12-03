
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  onBack: () => void;
}

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const ImageEditorScreen: React.FC<Props> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        const type = result.split(';')[0].split(':')[1];
        setMimeType(type);
        setNutritionData(null);
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = selectedImage.split(',')[1];

      // Use Flash 2.5 for multimodal analysis (Vision -> JSON)
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Analyse cette image de nourriture. Identifie le plat et estime ses valeurs nutritionnelles. Retourne UNIQUEMENT un JSON avec les clés : name (string, nom du plat en français), calories (number), protein (number), carbs (number), fat (number).",
            },
          ],
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER }
                }
            }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text) as NutritionData;
        setNutritionData(data);
      } else {
        setError("Impossible d'analyser l'image. Est-ce bien de la nourriture ?");
      }

    } catch (err: any) {
      console.error("Error analyzing image:", err);
      setError("Erreur lors de l'analyse. Vérifiez votre connexion.");
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
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
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
                 
                 {/* Overlay Data Card */}
                 {nutritionData && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white/20 animate-slide-up">
                        <h2 className="text-2xl font-bold text-text-light dark:text-white mb-1">{nutritionData.name}</h2>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-primary">{nutritionData.calories}</span>
                            <span className="text-sm text-gray-500 font-medium">kcal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <MacroItem label="Protéines" value={nutritionData.protein} color="text-warning" />
                            <MacroItem label="Glucides" value={nutritionData.carbs} color="text-accent" />
                            <MacroItem label="Lipides" value={nutritionData.fat} color="text-secondary" />
                        </div>
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

               {!nutritionData && !loading && (
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
                    setNutritionData(null);
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

const MacroItem: React.FC<{label: string; value: number; color: string}> = ({ label, value, color }) => (
    <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50 dark:bg-white/5">
        <span className="text-xs text-gray-500 mb-1">{label}</span>
        <span className={`text-lg font-bold ${color}`}>{value}g</span>
    </div>
);
