import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface BottomNavigationProps {
  onAddToBag?: () => void;
  productImage?: string;
  productName?: string;
}

export function BottomNavigation({ onAddToBag, productImage, productName }: BottomNavigationProps) {
  const { getTotalItems, canAddMore } = useCart();
  const totalItems = getTotalItems();
  const remaining = 3 - totalItems;

  const handleAddToBag = () => {
    if (onAddToBag && canAddMore()) {
      onAddToBag();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      
      <div className="bg-white border-t border-gray-200">
        <div className="flex items-stretch h-16">
          <div className="flex-1 flex items-center px-4 bg-gray-100">
            <div className="flex items-center gap-3 w-full">
              {productImage && (
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white">
                  <img 
                    src={productImage}
                    alt={productName || ''}
                    className="w-full h-full object-contain"
                    data-testid="bottom-nav-product-image"
                  />
                </div>
              )}
              
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-black font-bold text-xs uppercase tracking-wider">
                  QUANTIDADE
                </span>
                <span className="text-black font-bold text-lg leading-none">1</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToBag}
            disabled={!canAddMore()}
            className="flex-shrink-0 bg-[#FF2A52] hover:bg-[#e6244a] font-bold px-6 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shadow-lg relative group disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-add-to-bag"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShoppingBag className="w-5 h-5 relative z-10 text-white" strokeWidth={2.5} />
            <div className="flex flex-col items-start relative z-10">
              <span className="text-sm text-white whitespace-nowrap font-semibold">
                Adicionar à Sacola
              </span>
              <span className="text-[10px] text-white/80 whitespace-nowrap">
                {totalItems} de 3 selecionados · falta{remaining === 1 ? '' : 'm'} {remaining}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
