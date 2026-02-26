import { type User, type InsertUser, type Product, type ProductCard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<ProductCard[]>;
}

const reviewerNames = ["João M.", "Maria S.", "Pedro L.", "Ana C.", "Lucas R.", "Fernanda T.", "Carlos H.", "Juliana B.", "Rafael D.", "Camila P."];

const reviewPool = [
  { title: "Adorei a amostra", content: "Recebi o {name} da {brand} pelo programa e gostei bastante. A qualidade é boa, funciona direitinho. Já fiz meu vídeo mostrando o produto.", rating: 5 },
  { title: "Produto bom, gente", content: "Chegou rápido e bem embalado. O {name} da {brand} me surpreendeu, achei que ia ser menor mas o tamanho é bom. Valeu a pena participar do programa.", rating: 5 },
  { title: "Gostei muito", content: "Tô usando o {name} faz uns dias e tá funcionando bem. A {brand} manda bem na qualidade. Vou fazer o review em vídeo essa semana ainda.", rating: 5 },
  { title: "Bem legal o produto", content: "Não conhecia esse {name} da {brand} antes, mas depois que recebi a amostra grátis fiquei fã. Bem prático e bonito.", rating: 4 },
  { title: "Recomendo sim", content: "Recebi o {name} pelo programa de amostras e curti. A {brand} entrega o que promete. Já gravei o vídeo e postei no meu perfil.", rating: 5 },
  { title: "Muito satisfeita", content: "O {name} da {brand} é exatamente o que eu precisava. Recebi a amostra na semana passada e já tô usando todo dia. Nota 10.", rating: 5 },
  { title: "Surpreendeu demais", content: "Sinceramente não esperava tanto do {name}. A {brand} caprichou nesse produto. Meu vídeo de unboxing já tá no TikTok.", rating: 5 },
  { title: "Curti bastante", content: "A amostra do {name} da {brand} chegou super rápido. Produto de qualidade, sem defeito nenhum. Vou fazer mais vídeos mostrando.", rating: 4 },
  { title: "Produto top", content: "Quando vi que fui selecionada pra receber o {name} fiquei muito feliz. O produto é bonito e funciona certinho. Amei a {brand}.", rating: 5 },
  { title: "Vale muito a pena", content: "O {name} da {brand} é daqueles produtos que a gente usa e pensa: por que não conheci antes? Obrigada pelo programa de amostras!", rating: 5 },
  { title: "Chegou perfeito", content: "Recebi o {name} bem embalado, sem nenhum problema. Testei e tá funcionando super bem. A {brand} não decepciona mesmo.", rating: 5 },
  { title: "Indicaria pra todo mundo", content: "Mostrei o {name} da {brand} pra minha família e todo mundo gostou. Produto com boa qualidade e acabamento bonito.", rating: 4 },
  { title: "Fiquei impressionada", content: "O {name} é melhor do que eu imaginava. A {brand} realmente entrega qualidade. Gravei tudo no vídeo, ficou ótimo.", rating: 5 },
  { title: "Amei o produto", content: "Participei do programa e recebi o {name} da {brand}. Tô usando há uma semana e posso dizer que é muito bom mesmo. Recomendo.", rating: 5 },
  { title: "Muito bom", content: "O {name} atendeu minhas expectativas. Material resistente, bem feito. A {brand} sabe o que tá fazendo. Já postei meu vídeo.", rating: 5 },
];

function generateReviews(productName: string, brand: string): import("@shared/schema").Review[] {
  const hash = (productName + brand).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const startIdx = hash % reviewPool.length;
  const selected = Array.from({ length: 5 }, (_, i) => reviewPool[(startIdx + i) % reviewPool.length]);

  return selected.map((template, index) => ({
    id: `r${index + 1}`,
    rating: template.rating,
    author: reviewerNames[(hash + index) % reviewerNames.length],
    date: `${["15 de Janeiro", "22 de Janeiro", "3 de Fevereiro", "10 de Fevereiro", "18 de Fevereiro"][index]}, 2026`,
    title: template.title,
    content: template.content.replace(/\{name\}/g, productName).replace(/\{brand\}/g, brand),
    verifiedPurchase: true,
    helpful: Math.floor(((hash * (index + 1) * 7) % 200) + 50),
    images: [],
  }));
}

function generateProductImages(images: string[], productName: string): import("@shared/schema").ProductImage[] {
  return images.map((url, index) => ({
    url,
    alt: index === 0 ? `${productName} - Imagem Principal` : `${productName} - Imagem ${index + 1}`,
    type: "image" as const,
  }));
}

function getDescription(category: string, brand: string, name: string): string {
  switch (category) {
    case "Eletrônicos":
      return `Descubra a tecnologia de ponta da ${brand} com o ${name}. Design inovador com recursos avançados que transformam sua experiência digital no dia a dia.`;
    case "Cremes e Maquiagens":
      return `Transforme sua rotina de beleza com ${brand} ${name}. Fórmula inovadora desenvolvida para cuidar da sua pele e realçar sua beleza natural.`;
    case "Perfumes":
      return `Experimente a fragrância icônica ${name} da ${brand}. Uma composição sofisticada de notas que cria uma assinatura olfativa memorável e duradoura.`;
    case "Ferramentas":
      return `Conte com a qualidade profissional da ${brand} para seus projetos. O ${name} oferece desempenho superior e durabilidade para qualquer trabalho.`;
    case "Acessórios para Celular":
      return `Potencialize seu smartphone com o ${name} da ${brand}. Acessório essencial com qualidade premium para o seu dia a dia conectado.`;
    case "Gadgets e Tecnologia":
      return `O ${name} da ${brand} é o gadget perfeito para quem busca praticidade e inovação. Tecnologia acessível que facilita sua rotina.`;
    case "Casa e Cozinha":
      return `Deixe sua casa mais organizada e funcional com o ${name} da ${brand}. Qualidade e design pensados para o seu dia a dia.`;
    case "Utilidades":
      return `O ${name} da ${brand} é indispensável para o seu cotidiano. Produto prático, durável e com excelente custo-benefício.`;
    default:
      return "";
  }
}

function getRatingDistribution(rating: number): import("@shared/schema").RatingDistribution {
  if (rating >= 4.8) return { 5: 82, 4: 12, 3: 3, 2: 2, 1: 1 };
  if (rating >= 4.6) return { 5: 72, 4: 18, 3: 5, 2: 3, 1: 2 };
  if (rating >= 4.4) return { 5: 62, 4: 22, 3: 8, 2: 5, 1: 3 };
  return { 5: 55, 4: 25, 3: 10, 2: 6, 1: 4 };
}

function formatLovesCount(reviewCount: number): string {
  if (reviewCount >= 10000) return `${(reviewCount / 1000).toFixed(1)}K`;
  if (reviewCount >= 1000) return `${(reviewCount / 1000).toFixed(1)}K`;
  return `${reviewCount}`;
}

interface ProductData {
  id: string;
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sku: string;
  variantId: string;
  category: string;
}

const allProductData: ProductData[] = [
  // Eletrônicos - preços reais Amazon BR
  { id: "1", brand: "JBL", name: "Caixa de Som Bluetooth Go 3 Ultraportátil à Prova D'água", price: 349.90, rating: 4.7, reviewCount: 28450, images: ["https://m.media-amazon.com/images/I/71sGz2Y3byL._AC_SL500_.jpg"], sku: "ELEC001", variantId: "ELEC001V", category: "Eletrônicos" },
  { id: "2", brand: "Amazon", name: "Fire TV Stick HD com Alexa", price: 339.36, rating: 4.7, reviewCount: 25359, images: ["https://images-na.ssl-images-amazon.com/images/I/61Lg5RZZFQL._AC_SL500_.jpg"], sku: "ELEC002", variantId: "ELEC002V", category: "Eletrônicos" },
  { id: "3", brand: "Amazon", name: "Echo Dot 5ª Geração com Alexa", price: 456.38, rating: 4.8, reviewCount: 85155, images: ["https://images-na.ssl-images-amazon.com/images/I/71xoR4A6q-L._AC_SL500_.jpg"], sku: "ELEC003", variantId: "ELEC003V", category: "Eletrônicos" },
  { id: "4", brand: "Samsung", name: "Galaxy Fit3 Smartwatch Display 1.6\"", price: 238.00, rating: 4.7, reviewCount: 8735, images: ["https://images-na.ssl-images-amazon.com/images/I/51bjAlTBzZL._AC_SL500_.jpg"], sku: "ELEC004", variantId: "ELEC004V", category: "Eletrônicos" },
  { id: "5", brand: "Philips", name: "Fone de Ouvido com Microfone TAUE101", price: 29.50, rating: 4.5, reviewCount: 33321, images: ["https://images-na.ssl-images-amazon.com/images/I/51+W7A115SL._AC_SL500_.jpg"], sku: "ELEC005", variantId: "ELEC005V", category: "Eletrônicos" },
  { id: "6", brand: "Apple", name: "AirPods Pro 2ª Geração USB-C", price: 1899.00, rating: 4.8, reviewCount: 6791, images: ["https://images-na.ssl-images-amazon.com/images/I/41YmidweMtL._AC_SL500_.jpg"], sku: "ELEC006", variantId: "ELEC006V", category: "Eletrônicos" },

  // Cremes e Maquiagens
  { id: "7", brand: "L'Oréal Paris", name: "Elseve Óleo Extraordinário 100ml", price: 43.00, rating: 4.8, reviewCount: 108791, images: ["https://images-na.ssl-images-amazon.com/images/I/61BclXmbVtL._AC_SL500_.jpg"], sku: "BEAUTY001", variantId: "BEAUTY001V", category: "Cremes e Maquiagens" },
  { id: "8", brand: "La Roche-Posay", name: "Cicaplast Baume B5+ Multirreparador", price: 68.90, rating: 4.8, reviewCount: 17703, images: ["https://images-na.ssl-images-amazon.com/images/I/41LpbF-1WDL._AC_SL500_.jpg"], sku: "BEAUTY002", variantId: "BEAUTY002V", category: "Cremes e Maquiagens" },
  { id: "9", brand: "CeraVe", name: "Loção Hidratante Corporal com Ácido Hialurônico", price: 67.70, rating: 4.8, reviewCount: 79505, images: ["https://images-na.ssl-images-amazon.com/images/I/41tgKRWO90L._AC_SL500_.jpg"], sku: "BEAUTY003", variantId: "BEAUTY003V", category: "Cremes e Maquiagens" },
  { id: "10", brand: "NIVEA", name: "Kit Loção Hidratante Milk 400ml (2 unidades)", price: 39.90, rating: 4.8, reviewCount: 4127, images: ["https://images-na.ssl-images-amazon.com/images/I/71Exl60wVRL._AC_SL500_.jpg"], sku: "BEAUTY004", variantId: "BEAUTY004V", category: "Cremes e Maquiagens" },
  { id: "11", brand: "Hada Labo", name: "Gokujyun Oil Cleansing Facial 200ml", price: 72.90, rating: 4.7, reviewCount: 21212, images: ["https://images-na.ssl-images-amazon.com/images/I/61dJPM0QUyL._AC_SL500_.jpg"], sku: "BEAUTY005", variantId: "BEAUTY005V", category: "Cremes e Maquiagens" },
  { id: "12", brand: "NIVEA", name: "Hidratante Labial Amora Shine 4,8g", price: 16.90, rating: 4.8, reviewCount: 27528, images: ["https://images-na.ssl-images-amazon.com/images/I/71g4snU4xkL._AC_SL500_.jpg"], sku: "BEAUTY006", variantId: "BEAUTY006V", category: "Cremes e Maquiagens" },

  // Perfumes
  { id: "13", brand: "Lancôme", name: "La Vie Est Belle Eau de Parfum", price: 779.85, rating: 4.6, reviewCount: 23212, images: ["https://images-na.ssl-images-amazon.com/images/I/71CMnwDsoQL._AC_SL500_.jpg"], sku: "PERF001", variantId: "PERF001V", category: "Perfumes" },
  { id: "14", brand: "Nautica", name: "Voyage Eau de Toilette 100ml", price: 89.99, rating: 4.6, reviewCount: 10829, images: ["https://images-na.ssl-images-amazon.com/images/I/41bYQcKYVzL._AC_SL500_.jpg"], sku: "PERF002", variantId: "PERF002V", category: "Perfumes" },
  { id: "15", brand: "Granado", name: "Colônia Terrapeutics Cardamomo e Gengibre 230ml", price: 69.99, rating: 4.6, reviewCount: 4639, images: ["https://images-na.ssl-images-amazon.com/images/I/51gYeCO4zXL._AC_SL500_.jpg"], sku: "PERF003", variantId: "PERF003V", category: "Perfumes" },
  { id: "16", brand: "PHEBO", name: "Deo Colônia Limão Siciliano 200ml", price: 63.90, rating: 4.6, reviewCount: 10594, images: ["https://images-na.ssl-images-amazon.com/images/I/81dHQklZ1XL._AC_SL500_.jpg"], sku: "PERF004", variantId: "PERF004V", category: "Perfumes" },
  { id: "17", brand: "Gabriela Sabatini", name: "Eau de Toilette Feminino 60ml", price: 79.90, rating: 4.6, reviewCount: 6694, images: ["https://images-na.ssl-images-amazon.com/images/I/61NMHA6n0wL._AC_SL500_.jpg"], sku: "PERF005", variantId: "PERF005V", category: "Perfumes" },
  { id: "18", brand: "Joop!", name: "Homme Eau de Toilette 200ml", price: 199.00, rating: 4.6, reviewCount: 21335, images: ["https://images-na.ssl-images-amazon.com/images/I/61DcNovS1yL._AC_SL500_.jpg"], sku: "PERF006", variantId: "PERF006V", category: "Perfumes" },

  // Ferramentas
  { id: "19", brand: "Bosch", name: "Furadeira Parafusadeira GSR 1000 Smart 12V", price: 308.00, rating: 4.8, reviewCount: 8721, images: ["https://images-na.ssl-images-amazon.com/images/I/61nXSgxFHeL._AC_SL500_.jpg"], sku: "TOOL001", variantId: "TOOL001V", category: "Ferramentas" },
  { id: "20", brand: "Sparta", name: "Maleta de Ferramentas Kit 129 Peças", price: 99.90, rating: 4.7, reviewCount: 18880, images: ["https://images-na.ssl-images-amazon.com/images/I/61ZmjmMLsRL._AC_SL500_.jpg"], sku: "TOOL002", variantId: "TOOL002V", category: "Ferramentas" },
  { id: "21", brand: "WAP", name: "Parafusadeira Furadeira 12V BPF-12K3 com Maleta", price: 176.00, rating: 4.8, reviewCount: 20366, images: ["https://images-na.ssl-images-amazon.com/images/I/81hJD-odFeL._AC_SL500_.jpg"], sku: "TOOL003", variantId: "TOOL003V", category: "Ferramentas" },
  { id: "22", brand: "WD-40", name: "Produto Multiusos Aerossol 300ml", price: 36.75, rating: 4.9, reviewCount: 18683, images: ["https://images-na.ssl-images-amazon.com/images/I/41QHjZtHueL._AC_SL500_.jpg"], sku: "TOOL004", variantId: "TOOL004V", category: "Ferramentas" },
  { id: "23", brand: "3M Scotch", name: "Fixa Forte Fita Dupla Face Fixação Extrema 24mm x 2m", price: 36.90, rating: 4.6, reviewCount: 19524, images: ["https://images-na.ssl-images-amazon.com/images/I/71mEwfbHotL._AC_SL500_.jpg"], sku: "TOOL005", variantId: "TOOL005V", category: "Ferramentas" },
  { id: "24", brand: "Loctite", name: "Super Bonder Mega Adesivo Instantâneo 20g", price: 10.35, rating: 4.8, reviewCount: 3964, images: ["https://images-na.ssl-images-amazon.com/images/I/71HbwGwXAIL._AC_SL500_.jpg"], sku: "TOOL006", variantId: "TOOL006V", category: "Ferramentas" },

  // Acessórios para Celular - marcas menos conhecidas
  { id: "25", brand: "UGREEN", name: "Suporte Veicular Celular Ventilação 360° Universal", price: 59.90, rating: 4.5, reviewCount: 3842, images: ["https://m.media-amazon.com/images/I/61V1KWbrcvL._AC_SL500_.jpg"], sku: "ACEL001", variantId: "ACEL001V", category: "Acessórios para Celular" },
  { id: "26", brand: "Geonav", name: "Carregador Portátil Power Bank 10000mAh USB-C", price: 79.90, rating: 4.6, reviewCount: 5621, images: ["https://m.media-amazon.com/images/I/61qoIIr-qBL._AC_SL500_.jpg"], sku: "ACEL002", variantId: "ACEL002V", category: "Acessórios para Celular" },
  { id: "27", brand: "Baseus", name: "Cabo USB-C Carregamento Rápido 100W 1.5m Nylon", price: 34.90, rating: 4.4, reviewCount: 2103, images: ["https://m.media-amazon.com/images/I/616VkuL2B0L._AC_SL500_.jpg"], sku: "ACEL003", variantId: "ACEL003V", category: "Acessórios para Celular" },
  { id: "28", brand: "Hrebos", name: "Carregador Turbo 50W USB-C + Cabo Tipo C Premium", price: 42.90, rating: 4.2, reviewCount: 1449, images: ["https://m.media-amazon.com/images/I/619i-pfENrL._AC_SL500_.jpg"], sku: "ACEL004", variantId: "ACEL004V", category: "Acessórios para Celular" },
  { id: "29", brand: "Exbom", name: "Powerbank Solar 8000mAh com Lanterna Resistente à Água", price: 58.90, rating: 4.3, reviewCount: 1876, images: ["https://m.media-amazon.com/images/I/51XZ6RJTrIL._AC_SL500_.jpg"], sku: "ACEL005", variantId: "ACEL005V", category: "Acessórios para Celular" },
  { id: "30", brand: "Apexel", name: "Kit 3 Lentes Câmera Celular Macro + Wide + Olho de Peixe", price: 49.90, rating: 4.3, reviewCount: 2451, images: ["https://m.media-amazon.com/images/I/61UBqKwbbtL._AC_SL500_.jpg"], sku: "ACEL006", variantId: "ACEL006V", category: "Acessórios para Celular" },

  // Gadgets e Tecnologia - marcas genéricas/menos conhecidas
  { id: "31", brand: "Elgin", name: "Lâmpada LED Musical Bluetooth RGB com Controle Remoto", price: 29.99, rating: 4.4, reviewCount: 3215, images: ["https://m.media-amazon.com/images/I/71mnbtHXzcL._AC_SL500_.jpg"], sku: "GAD001", variantId: "GAD001V", category: "Gadgets e Tecnologia" },
  { id: "32", brand: "Knup", name: "Mini Teclado Sem Fio USB com Touchpad para Smart TV", price: 39.90, rating: 4.3, reviewCount: 4872, images: ["https://m.media-amazon.com/images/I/61J8CV40uCL._AC_SL500_.jpg"], sku: "GAD002", variantId: "GAD002V", category: "Gadgets e Tecnologia" },
  { id: "33", brand: "Kensington", name: "Apresentador de Slides Laser Sem Fio USB", price: 44.99, rating: 4.5, reviewCount: 1823, images: ["https://m.media-amazon.com/images/I/61MhpKibpxL._AC_SL500_.jpg"], sku: "GAD003", variantId: "GAD003V", category: "Gadgets e Tecnologia" },
  { id: "34", brand: "Comtac", name: "Estação de Carga USB 5 Portas 20W para Mesa", price: 77.28, rating: 4.6, reviewCount: 1345, images: ["https://m.media-amazon.com/images/I/41dnSpnbW8S._AC_SL500_.jpg"], sku: "GAD004", variantId: "GAD004V", category: "Gadgets e Tecnologia" },
  { id: "35", brand: "Havit", name: "Headphone Gamer H2002d com Microfone Falante 53mm", price: 109.90, rating: 4.7, reviewCount: 25175, images: ["https://m.media-amazon.com/images/I/71+kXnOiM2L._AC_SL500_.jpg"], sku: "GAD005", variantId: "GAD005V", category: "Gadgets e Tecnologia" },
  { id: "36", brand: "I2GO", name: "Microfone de Lapela para Smartphone P2 1.5m", price: 39.90, rating: 4.4, reviewCount: 2987, images: ["https://m.media-amazon.com/images/I/51Q3KuqNTgL._AC_SL500_.jpg"], sku: "GAD006", variantId: "GAD006V", category: "Gadgets e Tecnologia" },

  // Casa e Cozinha - marcas menos conhecidas
  { id: "37", brand: "Sanremo", name: "Conjunto 5 Potes Herméticos Transparentes com Tampa", price: 49.90, rating: 4.5, reviewCount: 3654, images: ["https://m.media-amazon.com/images/I/51vno2Maf3S._AC_SL500_.jpg"], sku: "CASA001", variantId: "CASA001V", category: "Casa e Cozinha" },
  { id: "38", brand: "Euro Home", name: "Garrafa Térmica Inox 750ml Dupla Parede", price: 59.90, rating: 4.6, reviewCount: 4231, images: ["https://m.media-amazon.com/images/I/418s2QWSpBL._AC_SL500_.jpg"], sku: "CASA002", variantId: "CASA002V", category: "Casa e Cozinha" },
  { id: "39", brand: "Mimo Style", name: "Organizador Multiuso com 3 Gavetas Empilháveis", price: 69.90, rating: 4.4, reviewCount: 2876, images: ["https://m.media-amazon.com/images/I/51vqbzhEhgL._AC_SL500_.jpg"], sku: "CASA003", variantId: "CASA003V", category: "Casa e Cozinha" },
  { id: "40", brand: "Coza", name: "Kit Banheiro 4 Peças Saboneteira Porta Escova", price: 54.90, rating: 4.5, reviewCount: 1987, images: ["https://m.media-amazon.com/images/I/41sRzCbzDxL._AC_SL500_.jpg"], sku: "CASA004", variantId: "CASA004V", category: "Casa e Cozinha" },
  { id: "41", brand: "KeHome", name: "Frigideira Antiaderente Cerâmica 24cm Cabo Madeira", price: 89.90, rating: 4.6, reviewCount: 3412, images: ["https://m.media-amazon.com/images/I/61gO0-JEtxL._AC_SL500_.jpg"], sku: "CASA005", variantId: "CASA005V", category: "Casa e Cozinha" },
  { id: "42", brand: "Brinox", name: "Jogo de Facas Inox 4 Peças com Cepo Madeira", price: 79.90, rating: 4.5, reviewCount: 2654, images: ["https://m.media-amazon.com/images/I/41edEWwyqKL._AC_SL500_.jpg"], sku: "CASA006", variantId: "CASA006V", category: "Casa e Cozinha" },

  // Utilidades - marcas genéricas/variadas
  { id: "43", brand: "Vonder", name: "Lanterna LED Recarregável USB 500 Lúmens Zoom", price: 45.90, rating: 4.5, reviewCount: 5432, images: ["https://m.media-amazon.com/images/I/31MuZF6mufL._AC_SL500_.jpg"], sku: "UTIL001", variantId: "UTIL001V", category: "Utilidades" },
  { id: "44", brand: "Rayovac", name: "Kit 24 Pilhas Alcalinas AA Economia", price: 49.90, rating: 4.7, reviewCount: 8321, images: ["https://m.media-amazon.com/images/I/61SljS37tgL._AC_SL500_.jpg"], sku: "UTIL002", variantId: "UTIL002V", category: "Utilidades" },
  { id: "45", brand: "Sandrini", name: "Kit 3 Camisetas Básicas Algodão Masculina", price: 69.90, rating: 4.3, reviewCount: 2187, images: ["https://m.media-amazon.com/images/I/51XD1LuaV0L._AC_SL500_.jpg"], sku: "UTIL003", variantId: "UTIL003V", category: "Utilidades" },
  { id: "46", brand: "Pano Tek", name: "Kit 10 Panos Microfibra Limpeza Automotiva 30x30cm", price: 29.90, rating: 4.6, reviewCount: 4567, images: ["https://m.media-amazon.com/images/I/51ZJjerxk6L._AC_SL500_.jpg"], sku: "UTIL004", variantId: "UTIL004V", category: "Utilidades" },
  { id: "47", brand: "Multilaser", name: "Balança Digital Corporal até 180kg Vidro Temperado", price: 59.90, rating: 4.4, reviewCount: 6543, images: ["https://m.media-amazon.com/images/I/41nIEWw0nsL._AC_SL500_.jpg"], sku: "UTIL005", variantId: "UTIL005V", category: "Utilidades" },
  { id: "48", brand: "Vollo Sports", name: "Corda de Pular Profissional com Rolamento Ajustável", price: 34.90, rating: 4.5, reviewCount: 3210, images: ["https://m.media-amazon.com/images/I/61elGMOFYHL._AC_SL500_.jpg"], sku: "UTIL006", variantId: "UTIL006V", category: "Utilidades" },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private productCards: ProductCard[];

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.productCards = [];
    this.initializeProducts();
  }

  private initializeProducts() {
    this.productCards = allProductData.map((p) => ({
      id: p.id,
      sku: p.sku,
      brand: p.brand,
      name: p.name,
      price: p.price,
      image: p.images[0],
      rating: p.rating,
      reviewCount: p.reviewCount,
      category: p.category,
      badges: [],
      inStock: true,
      variantId: p.variantId,
    }));

    for (const p of allProductData) {
      const product: Product = {
        id: p.id,
        itemNumber: p.id,
        sku: p.sku,
        variantId: p.variantId,
        brand: p.brand,
        name: p.name,
        category: p.category,
        rating: p.rating,
        reviewCount: p.reviewCount,
        lovesCount: formatLovesCount(p.reviewCount),
        price: p.price,
        originalValue: p.price,
        installmentPrice: Math.round((p.price / 4) * 100) / 100,
        installmentCount: 4,
        images: generateProductImages(p.images, p.name),
        badges: [],
        highlights: [],
        description: getDescription(p.category, p.brand, p.name),
        includedProducts: [],
        ingredients: {},
        inStock: true,
        shippingOptions: {
          sameDayDelivery: false,
          pickup: false,
        },
        reviews: generateReviews(p.name, p.brand),
        ratingDistribution: getRatingDistribution(p.rating),
        reviewImages: [],
      };
      this.products.set(p.id, product);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<ProductCard[]> {
    return this.productCards;
  }
}

export const storage = new MemStorage();
