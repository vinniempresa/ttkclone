import axios from 'axios';

const API_URL = 'https://api.ghostspaysv2.com/functions/v1';

function getAuthHeader(): string {
  const secretKey = process.env.GHOSTSPAY_SECRET_KEY;
  const companyId = process.env.GHOSTSPAY_COMPANY_ID;

  if (!secretKey || !companyId) {
    throw new Error('GHOSTSPAY_SECRET_KEY ou GHOSTSPAY_COMPANY_ID não configuradas');
  }

  const credentials = Buffer.from(`${secretKey}:${companyId}`).toString('base64');
  return `Basic ${credentials}`;
}

interface CreateTransactionParams {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  amount: number;
  items?: Array<{ title: string; unitPrice: number; quantity: number; tangible: boolean }>;
}

export interface GhostsPayTransaction {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  pix: {
    qrcode: string | null;
    expirationDate: string | null;
    end2EndId: string | null;
    receiptUrl: string | null;
  } | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: { number: string; type: string };
  };
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  refusedReason: any;
}

export async function createPixTransaction(params: CreateTransactionParams): Promise<GhostsPayTransaction> {
  const cpf = params.cpf.replace(/\D/g, '');
  const phone = params.phone ? params.phone.replace(/\D/g, '') : '11999999999';
  const amountInCents = Math.round(params.amount * 100);

  const payload = {
    amount: amountInCents,
    paymentMethod: 'PIX',
    customer: {
      name: params.name,
      email: params.email,
      phone: phone,
      document: {
        number: cpf,
        type: 'CPF'
      }
    },
    items: params.items || [{
      title: 'Frete - TikTok Shop Amostras Grátis',
      unitPrice: amountInCents,
      quantity: 1,
      tangible: false
    }]
  };

  const response = await axios.post(`${API_URL}/transactions`, payload, {
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json'
    },
    timeout: 15000
  });

  const data = response.data as GhostsPayTransaction;

  if (data.status === 'refused') {
    const reason = data.refusedReason?.description || 'Transação recusada pelo gateway';
    throw new Error(`Transação recusada: ${reason}`);
  }

  return data;
}

export async function getTransactionStatus(transactionId: string): Promise<GhostsPayTransaction> {
  const response = await axios.get(`${API_URL}/transactions/${transactionId}`, {
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });

  return response.data as GhostsPayTransaction;
}
