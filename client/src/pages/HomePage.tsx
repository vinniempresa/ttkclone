import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Star, Heart, ShoppingBag, ChevronRight } from "lucide-react";
import type { ProductCard } from "@shared/schema";
import { useTranslation } from "@/contexts/TranslationContext";
import { MobileHeader } from "@/components/MobileHeader";
import tiktokLogo from '@assets/logo-tiktok-CfBkyC_V_(1)_1771528904425.png';

function ProductCardComponent({ product }: { product: ProductCard }) {
  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="group cursor-pointer bg-white overflow-hidden"
        style={{ borderRadius: '6px' }}
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          <div className="absolute top-0 left-0">
            <span
              className="text-[10px] font-bold px-2.5 py-1 bg-[#FF2A52] text-white"
              style={{ borderRadius: '2px' }}
            >
              AMOSTRA GRÁTIS
            </span>
          </div>

          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>

          <div 
            className="absolute bottom-2 right-2 bg-[#FF2A52] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 gap-1.5"
            data-testid={`button-quickadd-${product.id}`}
          >
            <span className="text-[10px] font-bold text-white whitespace-nowrap">VER PRODUTO</span>
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="space-y-1 px-2.5 pb-3 pt-2">
          <p className="text-[11px] font-bold text-black uppercase tracking-wide">
            {product.brand}
          </p>
          <p className="text-[12px] text-gray-700 line-clamp-2 leading-tight min-h-[32px]">
            {product.name}
          </p>
          
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] text-gray-500 font-semibold">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-gray-400">
              ({formatReviewCount(product.reviewCount)})
            </span>
          </div>

          <div className="flex items-center gap-2 min-h-[20px]">
            <span className="font-bold text-[#FF2A52]">
              <span className="text-[14px]">R$ </span>
              <span className="text-[19px]">0</span>
              <span className="text-[14px] font-normal">,00</span>
            </span>
            <span className="text-[14px] text-gray-400/70 line-through">
              R${product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}


function HomeBreadcrumb() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-1.5 text-[12px]">
        <span className="text-gray-400">TikTok Shop</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-black font-semibold">Amostras Grátis</span>
      </div>
    </div>
  );
}

function HeroBanner() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tiktok_user');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.nome) setUserName(data.nome);
      }
    } catch {}
  }, []);

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://sf16-va.tiktokcdn.com/obj/eden-va2/aubvjjh_ylsslz_thahs/ljhwZthlaukjlkulzlp/register/mobile_main_banner_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      data-testid="img-hero-banner"
    >
      <div className="px-5 py-6">
        <p className="text-black text-[15px] leading-snug font-semibold">
          {userName ? (
            <>
              Prezado(a) <span className="font-bold text-[#FF2A52]">{userName}</span>, informamos que por se tratar do seu primeiro pedido de amostras grátis, foram liberados <span className="font-bold text-[#FF2A52]">até 3 produtos</span> para você escolher. Ao realizar os vídeos de acordo com as diretrizes estabelecidas, serão liberadas <span className="font-bold text-[#FF2A52]">10 amostras grátis</span> na próxima semana.
            </>
          ) : (
            <>
              Bem-vindo ao <span className="font-bold text-[#FF2A52]">TikTok Shop</span>. Cadastre-se para solicitar suas amostras grátis.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ title, showAll = true }: { title: string; showAll?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h2 className="text-[16px] font-bold text-black">{title}</h2>
      {showAll && (
        <button className="flex items-center gap-1 text-[12px] font-medium text-[#FF2A52]">
          Ver Tudo <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function HomePage() {
  const { data: products, isLoading, error } = useQuery<ProductCard[]>({
    queryKey: ['/api/products']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white max-w-[430px] mx-auto">
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#FF2A52] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="min-h-screen bg-white max-w-[430px] mx-auto">
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Erro ao carregar produtos</p>
        </div>
      </div>
    );
  }

  const categories = [
    { key: "Eletrônicos", label: "Eletrônicos" },
    { key: "Acessórios para Celular", label: "Acessórios para Celular" },
    { key: "Gadgets e Tecnologia", label: "Gadgets e Tecnologia" },
    { key: "Casa e Cozinha", label: "Casa e Cozinha" },
    { key: "Utilidades", label: "Utilidades" },
    { key: "Cremes e Maquiagens", label: "Cremes e Maquiagens" },
    { key: "Perfumes", label: "Perfumes" },
    { key: "Ferramentas", label: "Ferramentas" },
  ];

  const productsByCategory = categories.map(cat => ({
    ...cat,
    products: products.filter(p => p.category === cat.key).slice(0, 6)
  }));

  return (
    <div className="min-h-screen bg-[#F5F5F5] max-w-[430px] mx-auto" data-testid="page-home">
      <MobileHeader />
      <HomeBreadcrumb />
      <HeroBanner />

      <div className="pb-20">
        {productsByCategory.map((cat) => (
          <section key={cat.key} className="mt-8" data-testid={`section-category-${cat.key}`}>
            <SectionHeader title={cat.label} showAll={false} />
            <div className="grid grid-cols-2 gap-1.5 px-2">
              {cat.products.map((product) => (
                <ProductCardComponent key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="bg-black text-white py-8 px-4">
        <div className="text-center">
          <img 
            src={tiktokLogo} 
            alt="TikTok Shop" 
            className="h-6 mx-auto mb-4"
            data-testid="logo-tiktok-footer"
          />
          <p className="text-[11px] text-gray-400 mb-2">
            Sua loja favorita no TikTok
          </p>
          <div className="flex justify-center gap-6 text-[11px] text-gray-400">
            <span>Atendimento</span>
            <span>Nossas Lojas</span>
            <span>Sobre Nós</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
