import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createPixTransaction, getTransactionStatus } from "./ghostspay";

const geoCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/geolocation", async (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() 
        || (req.headers['x-real-ip'] as string)
        || req.socket.remoteAddress
        || req.ip;

      if (!clientIp) {
        return res.status(400).json({ error: 'Unable to determine client IP' });
      }

      const cached = geoCache.get(clientIp);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log('📦 Serving cached location for:', clientIp);
        return res.json(cached.data);
      }

      console.log('📍 Detecting location for IP:', clientIp);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const url = `http://ip-api.com/json/${clientIp}?fields=status,country,countryCode,city,regionName`;
      const response = await fetch(url, { signal: controller.signal });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'success' || !data.countryCode) {
        throw new Error('Invalid API response');
      }

      const result = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.regionName,
        ip: clientIp
      };

      geoCache.set(clientIp, { data: result, timestamp: Date.now() });
      
      console.log(`✅ Location: ${data.country} (${data.countryCode})`);
      res.json(result);

    } catch (error) {
      console.error('❌ Geolocation API failed:', error);
      res.status(503).json({ 
        error: 'Geolocation service temporarily unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/product", async (_req, res) => {
    try {
      const product = await storage.getProduct("189839");
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/cpf-lookup/:cpf", async (req, res) => {
    try {
      const cpf = req.params.cpf.replace(/\D/g, '');
      if (cpf.length !== 11) {
        return res.status(400).json({ error: "CPF inválido" });
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://api.amnesiatecnologia.rocks/?token=261207b9-0ec2-468a-ac04-f9d38a51da88&cpf=${cpf}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (!response.ok) {
        return res.status(404).json({ error: "CPF não encontrado" });
      }
      const data = await response.json();
      if (data?.DADOS?.nome) {
        return res.json({ nome: data.DADOS.nome });
      }
      return res.status(404).json({ error: "CPF não encontrado" });
    } catch {
      return res.status(500).json({ error: "Erro ao buscar CPF" });
    }
  });

  const FRETE_FIXO = 19.80;
  const TARIFA_IMPORTACAO = 74.80;

  app.post("/api/pix/create", async (req, res) => {
    try {
      const { name, email, cpf, phone } = req.body;
      if (!name || !email || !cpf) {
        return res.status(400).json({ error: "Campos obrigatórios: name, email, cpf" });
      }
      const transaction = await createPixTransaction({ name, email, cpf, phone, amount: FRETE_FIXO });
      res.json(transaction);
    } catch (error: any) {
      console.error("Erro ao criar transação PIX:", error?.response?.data || error.message);
      res.status(500).json({ error: error.message || "Erro ao criar transação PIX" });
    }
  });

  app.post("/api/pix/create-tarifa", async (req, res) => {
    try {
      const { name, email, cpf, phone } = req.body;
      if (!name || !email || !cpf) {
        return res.status(400).json({ error: "Campos obrigatórios: name, email, cpf" });
      }
      const transaction = await createPixTransaction({ name, email, cpf, phone, amount: TARIFA_IMPORTACAO });
      res.json(transaction);
    } catch (error: any) {
      console.error("Erro ao criar transação tarifa:", error?.response?.data || error.message);
      res.status(500).json({ error: error.message || "Erro ao criar transação PIX" });
    }
  });

  app.get("/api/pix/status/:id", async (req, res) => {
    try {
      const transaction = await getTransactionStatus(req.params.id);
      res.json(transaction);
    } catch (error: any) {
      console.error("Erro ao verificar status:", error?.response?.data || error.message);
      res.status(500).json({ error: error.message || "Erro ao verificar status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
