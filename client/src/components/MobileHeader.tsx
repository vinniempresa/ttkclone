import { ShoppingBag, User } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import tiktokLogo from '@assets/logo-tiktok-CfBkyC_V_(1)_1771528904425.png';

export function MobileHeader() {
  const { openCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#FF2A52] text-white text-center px-4 py-1.5 text-sm">
        <p data-testid="text-promo">
          Escolha até <strong>3 produtos</strong> totalmente <strong>GRÁTIS</strong>!
        </p>
      </div>
      <header 
        className="bg-black"
        data-testid="header-mobile"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img 
                src={tiktokLogo} 
                alt="TikTok Shop" 
                className="h-7"
                data-testid="logo-tiktok"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-5">
            <User className="w-6 h-6 text-white" />
            <button 
              onClick={openCart}
              className="relative"
              data-testid="button-basket"
            >
              <ShoppingBag className="w-6 h-6 text-white" />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF2A52] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  data-testid="cart-count"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
