
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

interface Product {
  id: number;
  name: string;
  category: 'BOWLS' | 'WRAPS' | 'SNACKS' | 'DRINKS';
  price: number;
  calories: number;
  protein: number;
  image: string;
  popular?: boolean;
}

export const MenuScreen: React.FC<Props> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('TOUT');
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    { id: 1, name: 'Power Bowl Poulet', category: 'BOWLS', price: 12.90, calories: 450, protein: 35, popular: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop' },
    { id: 2, name: 'Wrap Avocat Thon', category: 'WRAPS', price: 9.50, calories: 380, protein: 28, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=2864&auto=format&fit=crop' },
    { id: 3, name: 'Green Detox Juice', category: 'DRINKS', price: 5.90, calories: 120, protein: 2, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=2787&auto=format&fit=crop' },
    { id: 4, name: 'Cookie Protéiné', category: 'SNACKS', price: 3.50, calories: 210, protein: 15, popular: true, image: 'https://images.unsplash.com/photo-1499636138143-bd649043ea52?q=80&w=2787&auto=format&fit=crop' },
    { id: 5, name: 'Salmon Poke', category: 'BOWLS', price: 14.90, calories: 520, protein: 32, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd43fb?q=80&w=2787&auto=format&fit=crop' },
    { id: 6, name: 'Barre Énergie', category: 'SNACKS', price: 2.90, calories: 180, protein: 10, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2940&auto=format&fit=crop' },
  ];

  const filteredProducts = activeCategory === 'TOUT' ? products : products.filter(p => p.category === activeCategory);

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCartCount(c => c + 1);
  };

  return (
    <div className="flex flex-col min-h-full bg-background-light dark:bg-background-dark pb-32 font-display">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md pt-4 pb-2 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} aria-label="Retour" className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-text-light dark:text-text-dark" aria-hidden="true">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Menu</h1>
            <p className="text-xs text-secondary font-bold uppercase tracking-wide">Natty Fridge - Central Park</p>
          </div>
          <button aria-label="Voir le panier" className="p-2 -mr-2 rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors relative">
            <span className="material-symbols-outlined text-text-light dark:text-text-dark" aria-hidden="true">shopping_bag</span>
            {cartCount > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-warning text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                </span>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['TOUT', 'BOWLS', 'WRAPS', 'SNACKS', 'DRINKS'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-card-dark text-gray-500 border border-gray-200 dark:border-gray-800'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </header>

      <main className="p-4 flex flex-col gap-6">
        {/* Featured / Popular */}
        {activeCategory === 'TOUT' && (
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Les plus populaires 🔥</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                    {products.filter(p => p.popular).map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => setSelectedProduct(product)}
                            className="min-w-[260px] bg-white dark:bg-card-dark rounded-[2rem] p-3 shadow-lg border border-gray-100 dark:border-gray-800 relative group active:scale-[0.98] transition-transform cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label={`Voir les détails de ${product.name}`}
                        >
                            <div className="h-32 w-full rounded-2xl bg-cover bg-center mb-3 relative overflow-hidden" style={{backgroundImage: `url('${product.image}')`}}>
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-text-light dark:text-white shadow-sm">
                                    {product.calories} kcal
                                </div>
                            </div>
                            <div className="px-1">
                                <h3 className="font-bold text-text-light dark:text-text-dark text-lg leading-tight mb-1">{product.name}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-bold text-warning">{product.protein}g Protéines</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm font-medium text-gray-400">{product.price.toFixed(2)}€</span>
                                </div>
                                <button onClick={addToCart} aria-label={`Ajouter ${product.name} au panier`} className="w-full h-10 bg-primary/10 text-primary font-bold rounded-xl active:bg-primary active:text-white transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Product List */}
        <div>
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">La Carte</h2>
            <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map(product => (
                    <div 
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="flex gap-4 p-3 bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`Voir les détails de ${product.name}`}
                    >
                        <div className="size-24 rounded-xl bg-cover bg-center shrink-0" style={{backgroundImage: `url('${product.image}')`}}></div>
                        <div className="flex-1 py-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-text-light dark:text-text-dark">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold px-2 py-0.5 bg-warning/10 text-warning rounded-md">{product.protein}g Prot</span>
                                    <span className="text-xs font-medium text-gray-400">{product.calories} kcal</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="font-bold text-text-light dark:text-text-dark">{product.price.toFixed(2)}€</span>
                                <button onClick={addToCart} aria-label={`Ajouter ${product.name} au panier`} className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform">
                                    <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Floating Cart Button (if items in cart) */}
      {cartCount > 0 && (
          <div className="fixed bottom-24 left-4 right-4 z-30 animate-slide-up">
              <button className="w-full h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-between px-6 active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center size-8 bg-white/20 rounded-full font-bold text-sm backdrop-blur-md">{cartCount}</span>
                      <div className="flex flex-col items-start leading-none">
                          <span className="font-bold text-sm">Voir le panier</span>
                          <span className="text-xs opacity-80">Natty Fridge - Central Park</span>
                      </div>
                  </div>
                  <span className="font-bold text-lg">{(cartCount * 12.90).toFixed(2)}€</span>
              </button>
          </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProduct(null)}>
            <div 
                className="w-full bg-white dark:bg-[#1A1A1A] rounded-t-[2.5rem] p-6 pb-12 animate-slide-up relative overflow-hidden" 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-name"
            >
                {/* Product Image Header */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-cover bg-center" style={{backgroundImage: `url('${selectedProduct.image}')`}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1A1A1A] to-transparent"></div>
                </div>

                <div className="relative pt-32">
                     <div className="flex justify-between items-start mb-2">
                        <h2 id="product-name" className="text-3xl font-bold text-text-light dark:text-white w-3/4 leading-tight">{selectedProduct.name}</h2>
                        <span className="text-2xl font-bold text-primary">{selectedProduct.price.toFixed(2)}€</span>
                     </div>
                     <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                        Un délicieux mélange équilibré pour une récupération optimale. Poulet grillé, quinoa, avocat frais et sauce secrète Natty.
                     </p>
                     
                     {/* Macros Grid */}
                     <div className="grid grid-cols-3 gap-4 mb-8">
                         <MacroDetail label="Calories" value={`${selectedProduct.calories}`} unit="kcal" color="bg-gray-100 dark:bg-white/5 text-text-light dark:text-white" />
                         <MacroDetail label="Protéines" value={`${selectedProduct.protein}g`} unit="High" color="bg-warning/10 text-warning" />
                         <MacroDetail label="Glucides" value="45g" unit="Med" color="bg-accent/10 text-accent-dark dark:text-accent" />
                     </div>

                     {/* Customization */}
                     <div className="space-y-4 mb-8">
                        <h3 className="font-bold text-text-light dark:text-white">Personnalisation</h3>
                        <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <span className="text-sm font-medium dark:text-gray-300">Sans sauce</span>
                            <input type="checkbox" className="rounded text-primary focus:ring-primary bg-gray-100 dark:bg-gray-800 border-none" />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <span className="text-sm font-medium dark:text-gray-300">Extra Poulet (+2.50€)</span>
                            <input type="checkbox" className="rounded text-primary focus:ring-primary bg-gray-100 dark:bg-gray-800 border-none" />
                        </label>
                     </div>

                     <button 
                        onClick={() => {
                            addToCart({ stopPropagation: () => {} } as React.MouseEvent);
                            setSelectedProduct(null);
                        }}
                        className="w-full h-16 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform"
                     >
                        Ajouter au panier - {selectedProduct.price.toFixed(2)}€
                     </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const MacroDetail: React.FC<{label: string; value: string; unit: string; color: string}> = ({ label, value, unit, color }) => (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${color}`}>
        <p className="text-xs opacity-70 mb-1">{label}</p>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-[10px] opacity-60 mt-1">{unit}</p>
    </div>
);
