import { useTranslation } from '@/contexts/TranslationContext';
import { useCart } from '@/contexts/CartContext';
import { X, Trash2, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { ProductCard } from '@shared/schema';

export function CartModal() {
  const { t } = useTranslation();
  const { items, isCartOpen, closeCart, removeItem, getTotalItems, addItem, canAddMore } = useCart();
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const prevItemsCount = useRef(0);
  const totalItems = getTotalItems();
  const remaining = 6 - totalItems;

  useEffect(() => {
    if (totalItems === 6 && prevItemsCount.current < 6 && modalRef.current) {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevItemsCount.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    if (isCartOpen && modalRef.current) {
      modalRef.current.scrollTo({ top: 0 });
    }
  }, [isCartOpen]);

  const { data: allProducts } = useQuery<ProductCard[]>({
    queryKey: ['/api/products'],
    enabled: isCartOpen
  });

  const handleCheckout = () => {
    closeCart();
    setLocation('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    setLocation('/');
  };

  const handleAddFromModal = (product: ProductCard) => {
    if (!canAddMore()) return;
    addItem({
      id: product.id,
      sku: product.sku,
      variantId: product.variantId || '',
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image
    });
    setSelectedProduct(null);
  };

  const handleProductClick = (product: ProductCard) => {
    const isInCart = items.some(i => i.id === product.id);
    if (isInCart) {
      closeCart();
      setLocation(`/product/${product.id}`);
      return;
    }
    setSelectedProduct(selectedProduct?.id === product.id ? null : product);
  };

  const handleViewProduct = (product: ProductCard) => {
    setSelectedProduct(null);
    closeCart();
    setLocation(`/product/${product.id}`);
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const availableProducts = allProducts?.slice(0, 24) || [];

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-[100]"
            data-testid="cart-modal-backdrop"
          />
          
          <motion.div
            ref={modalRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[101] max-h-[90vh] overflow-y-auto"
            data-testid="cart-modal"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-sm font-bold text-black">
                Sua Sacola <span className="text-gray-500 font-semibold">({totalItems}/6)</span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                data-testid="button-close-cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-lg font-semibold text-black mb-1">
                    Sua sacola está vazia
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Escolha até 3 amostras grátis!
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="bg-[#FFE5EA] px-3 py-2 text-center"
                    style={{ borderRadius: '2px' }}
                  >
                    <p className="text-sm font-semibold text-[#E10742]">
                      {remaining > 0 
                        ? `Você selecionou ${totalItems} de 3 amostras · falta${remaining === 1 ? '' : 'm'} ${remaining}`
                        : 'Você selecionou todas as 3 amostras!'
                      }
                    </p>
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100" data-testid={`cart-item-${item.id}`}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded bg-gray-50"
                        data-testid={`cart-item-image-${item.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase">{item.brand}</p>
                        <h3 className="font-semibold text-xs text-black mb-1 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#FF2A52] text-sm">
                            <span className="text-[10px]">R$ </span>0<span className="text-[10px] font-normal">,00</span>
                          </span>
                          <span className="text-[10px] text-gray-400/70 line-through">
                            R${item.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors self-center"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}

              {items.length > 0 && totalItems >= 1 && (
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#FF2A52] text-white py-4 font-semibold transition-colors"
                    style={{ borderRadius: '2px' }}
                    data-testid="button-checkout"
                  >
                    Finalizar Pedido
                  </button>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-[16px] font-bold text-black mb-3">Todos os Produtos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableProducts.map((product) => {
                    const isInCart = items.some(i => i.id === product.id);
                    const isSelected = selectedProduct?.id === product.id;
                    return (
                      <div 
                        key={product.id} 
                        className={`${isInCart ? 'opacity-50' : ''}`}
                        data-testid={`modal-product-${product.id}`}
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="relative bg-[#F6F6F6] aspect-square mb-2" style={{ borderRadius: '2px' }}>
                            <img
                              src={product.image}
                              alt={`${product.brand} ${product.name}`}
                              className="w-full h-full object-contain p-2"
                              loading="lazy"
                            />
                            <div className="absolute top-0 left-0">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 bg-[#FF2A52] text-white"
                                style={{ borderRadius: '2px' }}
                              >
                                AMOSTRA GRÁTIS
                              </span>
                            </div>
                            {isInCart && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-[#FF2A52] bg-white px-2 py-1 shadow" style={{ borderRadius: '2px' }}>
                                  NA SACOLA
                                </span>
                              </div>
                            )}
                            {isSelected && !isInCart && (
                              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 p-2">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddFromModal(product);
                                  }}
                                  disabled={!canAddMore()}
                                  className="w-full bg-[#FF2A52] border-[#FF2A52] text-white text-[11px] font-bold gap-1.5"
                                  style={{ borderRadius: '2px' }}
                                  data-testid={`button-modal-add-${product.id}`}
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  Adicionar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProduct(product);
                                  }}
                                  className="w-full bg-[#FF2A52]/30 text-white text-[11px] font-semibold border-0"
                                  style={{ borderRadius: '2px' }}
                                  data-testid={`button-modal-view-${product.id}`}
                                >
                                  Ver Produto
                                </Button>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-black uppercase tracking-wide mt-1">
                            {product.brand}
                          </p>
                          <p className="text-[11px] text-gray-700 line-clamp-2 leading-tight min-h-[28px]">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= Math.floor(product.rating)
                                      ? "fill-[#FF2A52] text-[#FF2A52]"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-gray-500">
                              {formatReviewCount(product.reviewCount)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-[#FF2A52]">
                              <span className="text-[13px]">R$ </span>
                              <span className="text-[18px]">0</span>
                              <span className="text-[13px] font-normal">,00</span>
                            </span>
                            <span className="text-[13px] text-gray-400/70 line-through">
                              R${product.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
