import axios from 'axios';

const API_URL = 'https://api.realtechdev.com.br';
const USER_AGENT = 'Buckpay API';

function getHeaders() {
  const secretKey = process.env.BUCKPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error('BUCKPAY_SECRET_KEY não configurada');
  }
  return {
    'Authorization': `Bearer ${secretKey}`,
    'User-Agent': USER_AGENT,
    'Content-Type': 'application/json',
  };
}

function generateExternalId(): string {
  return `tiktok-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let rem = sum % 11;
  if ((rem < 2 ? 0 : 11 - rem) !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  rem = sum % 11;
  return (rem < 2 ? 0 : 11 - rem) === parseInt(cpf[10]);
}

interface CreateTransactionParams {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  amount: number;
}

export interface BuckPayTransaction {
  id: string;
  status: string;
  pix: {
    qrcode: string | null;
  } | null;
  amount: number;
}

export async function createPixTransaction(params: CreateTransactionParams): Promise<BuckPayTransaction> {
  const cpf = params.cpf.replace(/\D/g, '');
  const phone = params.phone ? params.phone.replace(/\D/g, '') : '';
  const phone55 = phone.startsWith('55') ? phone : `55${phone}`;
  const amountInCents = Math.round(params.amount * 100);
  const externalId = generateExternalId();

  const buyer: any = {
    name: params.name,
    email: params.email,
  };
  if (isValidCPF(cpf) || cpf.length === 14) {
    buyer.document = cpf;
  }
  if (phone55.length >= 12) {
    buyer.phone = phone55.slice(0, 13);
  }

  const payload: any = {
    external_id: externalId,
    payment_method: 'pix',
    amount: amountInCents,
    buyer,
  };

  const response = await axios.post(`${API_URL}/v1/transactions`, payload, {
    headers: getHeaders(),
    timeout: 15000,
  });

  const data = response.data?.data;

  return {
    id: externalId,
    status: data.status,
    amount: data.total_amount,
    pix: data.pix ? { qrcode: data.pix.code || null } : null,
  };
}

export async function getTransactionStatus(externalId: string): Promise<BuckPayTransaction> {
  const response = await axios.get(
    `${API_URL}/v1/transactions/external_id/${externalId}`,
    {
      headers: getHeaders(),
      timeout: 10000,
    }
  );

  const data = response.data?.data;

  return {
    id: externalId,
    status: data.status,
    amount: data.total_amount,
    pix: null,
  };
}
