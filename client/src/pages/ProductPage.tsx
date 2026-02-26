import { useQuery } from '@tanstack/react-query';
import { useRoute, Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { MobileHeader } from '@/components/MobileHeader';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { ProductInfo } from '@/components/ProductInfo';
import { ReviewsSection } from '@/components/ReviewsSection';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@shared/schema';

export default function ProductPage() {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id;
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [, setLocation] = useLocation();
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
    enabled: !!productId
  });

  const handleAddToBag = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      sku: product.sku,
      variantId: product.variantId || '',
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0]?.url || ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MobileHeader />
        <div className="pt-[120px] pb-[68px]">
          <Skeleton className="w-full aspect-square" />
          <div className="p-4 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!productId || error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-[60vh] p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-black">Produto Não Encontrado</h2>
            <p className="text-gray-500">Desculpe, não encontramos este produto.</p>
            <Link href="/">
              <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                Voltar à Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />
      
      <main className="pb-[68px]">
        <div className="px-4 py-2.5 bg-white">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-1.5 text-[13px] text-gray-600 font-medium"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        </div>
        
        <ProductInfo
          brand={product.brand}
          name={product.name}
          rating={product.rating}
          reviewCount={product.reviewCount}
          lovesCount={product.lovesCount}
          price={product.price}
          originalValue={product.originalValue}
          installmentPrice={product.installmentPrice}
          installmentCount={product.installmentCount}
          inStock={product.inStock}
        />
        
        <ProductImageGallery 
          images={product.images}
          productName={product.name}
        />
        
        <div className="bg-white px-4 py-6" data-testid="section-about">
          <h2 className="text-xl font-semibold text-black mb-4">{t.aboutProduct}</h2>
          
          <p className="text-xs text-gray-500 mb-4">Item {product.itemNumber}</p>
          
          <div className="space-y-4 text-black">
            <div>
              <h3 className="font-semibold text-sm mb-2">{t.whatItIs}</h3>
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
        
        <ReviewsSection product={product} />
      </main>
      
      <footer className="bg-black text-white py-8 px-4 text-center">
        <p className="text-xs mb-2">{t.footerCopyright}</p>
        <div className="flex items-center justify-center gap-3 text-xs mb-4">
          <a href="#" className="underline">{t.footerTermsOfUse}</a>
          <span>|</span>
          <a href="#" className="underline">{t.footerPrivacyPolicy}</a>
        </div>
        <p className="text-xs mb-1">{t.footerPhone}</p>
        <p className="text-xs">{t.footerEmail}</p>
      </footer>
      
      <BottomNavigation 
        onAddToBag={handleAddToBag} 
        productImage={product.images[0]?.url}
        productName={product.name}
      />
    </div>
  );
}
