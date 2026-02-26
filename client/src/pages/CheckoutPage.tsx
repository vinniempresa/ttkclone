import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { ChevronDown, ChevronUp, Trash2, Package } from 'lucide-react';
import tiktokLogo from '@assets/logo-tiktok-CfBkyC_V_(1)_1771528904425.png';

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items, removeItem, clearCart } = useCart();
  const [showOrderSummary, setShowOrderSummary] = useState(true);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tiktok_user');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.nome) setNome(data.nome);
        if (data.cpf) setCpf(data.cpf);
        if (data.email) setEmail(data.email);
        if (data.telefone) setTelefone(data.telefone);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;

    setCepLoading(true);
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then(r => r.json())
      .then(data => {
        if (!data.erro) {
          setEstado(data.uf || '');
          setCidade(data.localidade || '');
          setBairro(data.bairro || '');
          setEndereco(data.logradouro || '');
        }
      })
      .catch(() => {})
      .finally(() => setCepLoading(false));
  }, [cep]);

  const formatCEP = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const canSubmit = nome.trim() && telefone.trim() && email.trim() && cep.replace(/\D/g, '').length === 8 && estado && cidade.trim() && endereco.trim() && numero.trim() && items.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome,
          email,
          cpf: cpf.replace(/\D/g, ''),
          phone: telefone.replace(/\D/g, ''),
          amount: 19.80
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar pagamento');

      const paymentData = {
        transactionId: data.id,
        qrcode: data.pix?.qrcode || '',
        amount: 19.80,
        nome,
        email,
        cpf: cpf.replace(/\D/g, ''),
        phone: telefone.replace(/\D/g, ''),
        endereco: `${endereco}, ${numero}${complemento ? ' - ' + complemento : ''}, ${bairro}, ${cidade} - ${estado}, ${cep}`,
        items: items.map(i => ({ id: i.id, name: i.name, brand: i.brand, image: i.image, price: i.price })),
        createdAt: Date.now()
      };
      localStorage.setItem('tiktok_payment', JSON.stringify(paymentData));
      setLocation(`/pagamento?tx=${data.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao processar pagamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <Package className="w-12 h-12 text-gray-300 mb-3" />
        <h1 className="text-lg font-bold text-black mb-2">Sua sacola está vazia</h1>
        <p className="text-sm text-gray-500 mb-6">Adicione até 6 amostras grátis para continuar.</p>
        <button
          onClick={() => setLocation('/')}
          className="bg-[#FF2A52] text-white font-semibold text-sm px-8 py-3"
          style={{ borderRadius: '6px' }}
          data-testid="button-shop-now"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  const inputClass = "w-full h-12 px-4 border-b border-gray-200/60 text-[16px] text-black placeholder-gray-400 outline-none focus:border-[#25F4EE] transition-colors bg-transparent";
  const selectClass = "w-full h-12 px-4 border-b border-gray-200/60 text-[16px] text-black outline-none focus:border-[#25F4EE] transition-colors bg-transparent appearance-none";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-[430px] mx-auto">
      {/* Sticky black header with logo */}
      <header className="sticky top-0 z-50 bg-black py-3 flex items-center justify-center" data-testid="header-checkout">
        <img src={tiktokLogo} alt="TikTok Shop" className="h-5" data-testid="logo-checkout" />
      </header>

      {/* Order Summary */}
      <div className="bg-white mb-2">
        <button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="w-full px-4 py-3 flex items-center justify-between gap-2"
          data-testid="button-toggle-summary"
        >
          <span className="text-[14px] font-semibold text-black">
            Resumo do Pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </span>
          {showOrderSummary ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {showOrderSummary && (
          <div className="px-4 pb-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center" data-testid={`checkout-item-${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-contain rounded bg-[#F6F6F6] p-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-500 uppercase">{item.brand}</p>
                  <p className="text-[12px] text-black font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[13px] font-bold text-[#FF2A52]">R$ 0,00</span>
                    <span className="text-[11px] text-gray-400 line-through">R${item.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-gray-400"
                  data-testid={`button-remove-checkout-${item.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-black">R$ 0,00</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Frete</span>
                <span className="font-semibold text-black">R$ 19,80</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-gray-100">
                <span className="text-black">Total</span>
                <span className="text-black">R$ 19,80</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white mb-2 px-4 py-4">
        <h2 className="text-[14px] font-semibold text-black mb-4">Informações de contato</h2>
        <div className="space-y-1">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className={inputClass}
            data-testid="input-checkout-nome"
          />
          <input
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            placeholder="CPF"
            maxLength={14}
            className={inputClass}
            data-testid="input-checkout-cpf"
          />
          <div className="flex items-center border-b border-gray-200/60">
            <span className="text-[13px] text-gray-500 pl-4 pr-2 whitespace-nowrap">BR +55</span>
            <input
              type="text"
              inputMode="numeric"
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              placeholder="Número de telefone"
              maxLength={15}
              className="flex-1 h-12 px-2 text-[16px] text-black placeholder-gray-400 outline-none bg-transparent"
              data-testid="input-checkout-telefone"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className={inputClass}
            data-testid="input-checkout-email"
          />
        </div>
      </div>

      {/* Address Info */}
      <div className="bg-white mb-2 px-4 py-4">
        <h2 className="text-[14px] font-semibold text-black mb-4">Informações de endereço</h2>
        <div className="space-y-1">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={cep}
              onChange={(e) => setCep(formatCEP(e.target.value))}
              placeholder="CEP/Código postal"
              maxLength={9}
              className={inputClass}
              data-testid="input-checkout-cep"
            />
            {cepLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#25F4EE] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex gap-0">
            <div className="relative flex-1">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className={selectClass}
                data-testid="select-checkout-estado"
              >
                <option value="">Estado/UF</option>
                {ESTADOS_BR.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
                className={inputClass}
                data-testid="input-checkout-cidade"
              />
            </div>
          </div>

          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro/Distrito"
            className={inputClass}
            data-testid="input-checkout-bairro"
          />
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço"
            className={inputClass}
            data-testid="input-checkout-endereco"
          />
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder='Nº da residência. Use "s/n" se nenhum'
            className={inputClass}
            data-testid="input-checkout-numero"
          />
          <input
            type="text"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            placeholder="Apartamento, bloco, unidade etc. (opcional)"
            className={inputClass}
            data-testid="input-checkout-complemento"
          />
        </div>
      </div>

      {/* Settings/Privacy */}
      <div className="bg-white mb-2 px-4 py-4">
        <h2 className="text-[14px] font-semibold text-black mb-2">Configurações</h2>
        <p className="text-[12px] text-gray-500 leading-relaxed">
          Leia a <span className="text-[#25F4EE] font-semibold">Política de privacidade do TikTok</span> para saber mais sobre como usamos suas informações pessoais.
        </p>
      </div>

      {/* Submit Button */}
      <div className="px-4 py-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full py-4 font-semibold text-[15px] text-white transition-colors disabled:opacity-40"
          style={{
            borderRadius: '6px',
            background: canSubmit && !isSubmitting ? '#FF2A52' : '#FFBCC8',
          }}
          data-testid="button-continuar-checkout"
        >
          {isSubmitting ? 'Gerando pagamento...' : 'Continuar'}
        </button>
        {submitError && (
          <p className="text-xs text-red-500 text-center mt-2" data-testid="text-submit-error">{submitError}</p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="text-center">
          <img
            src={tiktokLogo}
            alt="TikTok Shop"
            className="h-6 mx-auto mb-4"
            data-testid="logo-tiktok-footer-checkout"
          />
          <p className="text-[11px] text-gray-400 mb-2">
            Sua loja favorita no TikTok
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap text-[11px] text-gray-500">
            <span>Termos de Uso</span>
            <span>Privacidade</span>
            <span>Sobre Nós</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
