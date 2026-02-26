import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ShopifyCheckoutModalProps {
  checkoutUrl: string;
  onClose: () => void;
}

export function ShopifyCheckoutModal({ checkoutUrl, onClose }: ShopifyCheckoutModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] m-4 bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-tiktok-black">Complete Your Purchase</h2>
            <p className="text-sm text-tiktok-gray mt-1">Secure Checkout by Shopify</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close checkout"
            data-testid="button-close-checkout"
          >
            <X className="w-6 h-6 text-tiktok-black" />
          </button>
        </div>

        {/* Iframe Content */}
        <div className="flex-1 relative overflow-hidden">
          <iframe
            src={checkoutUrl}
            className="w-full h-full border-0"
            title="Shopify Checkout"
            allow="payment"
            data-testid="iframe-shopify-checkout"
          />
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-center gap-2 text-xs text-tiktok-gray">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-medium">Secure SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
