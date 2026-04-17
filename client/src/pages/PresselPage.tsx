import { useLocation } from 'wouter';
import { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, Eye, Clock, CheckCircle2, ChevronRight, Star } from 'lucide-react';

const BLOG_LOGO = "https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png";

const HERO_IMG = "https://m.media-amazon.com/images/I/71sGz2Y3byL._AC_SL500_.jpg";

const COMMENTS = [
  {
    avatar: "https://i.pravatar.cc/40?img=11",
    name: "Camila Rocha",
    time: "2h atrás",
    text: "Recebi meu kit semana passada! Super recomendo, chegou tudo certinho.",
    likes: 38,
  },
  {
    avatar: "https://i.pravatar.cc/40?img=24",
    name: "Rafael Mendes",
    time: "5h atrás",
    text: "Já pedi a minha seleção. Processo bem simples mesmo, demorou uns 5 minutos.",
    likes: 21,
  },
  {
    avatar: "https://i.pravatar.cc/40?img=47",
    name: "Juliana Costa",
    time: "1d atrás",
    text: "Nossa, não sabia desse programa! Vou tentar agora. Obrigada pelo artigo!",
    likes: 55,
  },
  {
    avatar: "https://i.pravatar.cc/40?img=32",
    name: "Marcos Oliveira",
    time: "1d atrás",
    text: "Funcionou aqui. Escolhi 3 produtos e paguei só o frete. Vale demais.",
    likes: 17,
  },
  {
    avatar: "https://i.pravatar.cc/40?img=56",
    name: "Priscila Fernandes",
    time: "2d atrás",
    text: "Testei ontem e aprovei! Chegou notificação de confirmação na hora.",
    likes: 29,
  },
];

const PRODUCT_SAMPLES = [
  { img: "https://m.media-amazon.com/images/I/71sGz2Y3byL._AC_SL500_.jpg", name: "Fone Bluetooth Premium", tag: "Mais solicitado" },
  { img: "https://images-na.ssl-images-amazon.com/images/I/61Lg5RZZFQL._AC_SL500_.jpg", name: "Smart Watch Esportivo", tag: "Disponível" },
  { img: "https://images-na.ssl-images-amazon.com/images/I/71xoR4A6q-L._AC_SL500_.jpg", name: "Caixa de Som Portátil", tag: "Disponível" },
  { img: "https://images-na.ssl-images-amazon.com/images/I/51bjAlTBzZL._AC_SL500_.jpg", name: "Carregador Turbo 65W", tag: "Limitado" },
  { img: "https://images-na.ssl-images-amazon.com/images/I/51+W7A115SL._AC_SL500_.jpg", name: "Câmera de Segurança Wi-Fi", tag: "Disponível" },
  { img: "https://images-na.ssl-images-amazon.com/images/I/41YmidweMtL._AC_SL500_.jpg", name: "Purificador de Ar Mini", tag: "Mais solicitado" },
];

export default function PresselPage() {
  const [, navigate] = useLocation();
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const toggleLike = (i: number) => {
    setLikedComments(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const goToFunnel = () => navigate('/informativo');

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* Topbar blog */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={BLOG_LOGO} alt="TikTok" className="h-7 w-7 rounded-full" />
            <span className="text-[15px] font-bold text-black tracking-tight">TikTok Shop <span className="text-[#fe2c55] font-extrabold">Notícias</span></span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>48.291 leitores</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {/* Category tag */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="bg-[#fe2c55] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Exclusivo</span>
          <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">TikTok Shop</span>
        </div>

        {/* Headline */}
        <h1 className="text-[22px] font-extrabold text-gray-900 leading-tight mb-3">
          TikTok Shop lança programa de amostras grátis para usuários brasileiros — e poucos sabem que podem participar
        </h1>

        {/* Byline */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <img src="https://i.pravatar.cc/40?img=5" alt="Autor" className="w-9 h-9 rounded-full border border-gray-200" />
          <div>
            <p className="text-[13px] font-semibold text-gray-800">Ana Beatriz Lima · Redação TTS Notícias</p>
            <div className="flex items-center gap-1 text-gray-400 text-[12px]">
              <Clock className="w-3 h-3" />
              <span>17 de abril de 2026 · 4 min de leitura</span>
            </div>
          </div>
        </div>

        {/* Social counts */}
        <div className="flex items-center gap-4 border-y border-gray-200 py-2.5 mb-5 text-gray-500 text-[13px]">
          <button className="flex items-center gap-1 hover:text-[#fe2c55] transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span>2.847</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>312</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </div>

        {/* Hero image */}
        <div className="rounded-xl overflow-hidden mb-5 shadow-sm">
          <img
            src="https://sf16-va.tiktokcdn.com/obj/eden-va2/aubvjjh_ylsslz_thahs/ljhwZthlaukjlkulzlp/register/mobile_main_banner_bg.png"
            alt="TikTok Shop"
            className="w-full object-cover max-h-52"
          />
          <p className="text-[11px] text-gray-400 bg-gray-50 px-3 py-1.5">Foto: TikTok Shop / Divulgação</p>
        </div>

        {/* Article body */}
        <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed space-y-4">
          <p className="text-[16px] font-semibold text-gray-900">
            A plataforma global TikTok Shop acaba de confirmar uma iniciativa inédita no Brasil: o <strong>Programa de Avaliadores Verificados</strong>, que permite a usuários selecionados receberem até 3 produtos sem pagar pelo preço dos itens.
          </p>

          <p>
            O programa existe há anos em países como Estados Unidos, Reino Unido e Japão — mas só agora chegou oficialmente ao mercado brasileiro. A estratégia faz parte do plano de expansão da plataforma na América Latina, que investiu mais de R$ 2 bilhões na região em 2025.
          </p>

          <div className="bg-[#fff8f9] border border-[#fe2c55]/20 rounded-xl p-4">
            <p className="text-[13px] font-bold text-[#fe2c55] uppercase tracking-wide mb-1">Como funciona</p>
            <ul className="list-none space-y-2 text-[15px]">
              {[
                "Você seleciona até 3 produtos do catálogo oficial",
                "Paga somente o frete e eventuais taxas de importação",
                "Os produtos chegam em casa normalmente",
                "Você avalia o produto dentro do app (opcional)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#fe2c55] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>
            Segundo fontes internas da plataforma, a iniciativa tem como objetivo aumentar o número de avaliações autênticas de produtos vendidos no TikTok Shop. <strong>Os primeiros lotes de participação são limitados</strong>, e a plataforma vai expandindo conforme a demanda.
          </p>

          {/* Inline product grid */}
          <div>
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">Alguns dos produtos disponíveis no programa</p>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCT_SAMPLES.map((p, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <img src={p.img} alt={p.name} className="w-full aspect-square object-cover" />
                  <div className="p-1.5">
                    <p className="text-[10px] text-gray-700 font-semibold leading-tight line-clamp-2">{p.name}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${p.tag === 'Limitado' ? 'bg-orange-100 text-orange-600' : p.tag === 'Mais solicitado' ? 'bg-red-100 text-[#fe2c55]' : 'bg-green-100 text-green-700'}`}>
                      {p.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p>
            Para verificar se você tem acesso ao programa, basta acessar a página oficial do TikTok Shop e seguir o processo de verificação de elegibilidade. O processo leva menos de 5 minutos e é feito diretamente pelo celular.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-[13px] text-gray-600 font-medium">4,9 de 5 · 3.241 avaliações</span>
            </div>
            <p className="text-[14px] text-gray-700 italic">
              "Fiz o processo em menos de 10 minutos, escolhi meus produtos e recebi em 7 dias úteis. Tudo certinho e sem cobrança dos itens."
            </p>
            <p className="text-[12px] text-gray-400 mt-1.5">— Fernanda T., São Paulo · Participante verificada</p>
          </div>

          <p>
            A reportagem entrou em contato com o suporte do TikTok Shop, que confirmou o programa e orientou usuários interessados a acessar diretamente a página oficial para verificar disponibilidade em sua região.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6 mb-8">
          <button
            onClick={goToFunnel}
            data-testid="button-pressel-cta"
            className="w-full bg-[#fe2c55] text-white font-bold text-[17px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
          >
            Ver se tenho acesso ao programa
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-center text-[12px] text-gray-400 mt-2">Verificação gratuita · Sem compromisso</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6" />

        {/* Comments section */}
        <div>
          <h2 className="text-[17px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#fe2c55]" />
            Comentários ({COMMENTS.length + 307})
          </h2>
          <div className="space-y-4">
            {COMMENTS.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full border border-gray-100" />
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">{c.name}</p>
                    <p className="text-[11px] text-gray-400">{c.time}</p>
                  </div>
                </div>
                <p className="text-[14px] text-gray-700 leading-snug mb-2">{c.text}</p>
                <button
                  onClick={() => toggleLike(i)}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${likedComments.has(i) ? 'text-[#fe2c55]' : 'text-gray-400'}`}
                  data-testid={`button-like-comment-${i}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{c.likes + (likedComments.has(i) ? 1 : 0)}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <button
          onClick={goToFunnel}
          data-testid="button-pressel-sticky-cta"
          className="w-full max-w-2xl mx-auto block bg-[#fe2c55] text-white font-bold text-[16px] py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Verificar minha elegibilidade agora
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
