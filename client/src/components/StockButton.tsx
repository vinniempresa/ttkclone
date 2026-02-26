interface StockButtonProps {
  inStock: boolean;
}

export function StockButton({ inStock }: StockButtonProps) {
  return (
    <button 
      disabled={!inStock}
      className={`w-full h-12 rounded text-base font-semibold transition-opacity ${
        inStock
          ? 'bg-[#FF2A52] text-white hover-elevate active-elevate-2'
          : 'bg-tiktok-light-gray text-tiktok-gray cursor-not-allowed'
      }`}
      data-testid="button-add-to-basket"
    >
      {inStock ? 'Adicionar à Sacola' : 'Fora de Estoque'}
    </button>
  );
}
