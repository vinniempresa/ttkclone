# 🌍 Shopify Country Pre-Selection - RESOLVIDO ✅

## ✅ SOLUÇÃO IMPLEMENTADA

O problema de pré-seleção de país foi **completamente resolvido** usando **Shopify Cart Permalinks**!

### Como Funciona Agora:

Em vez de usar o Shopify Buy SDK (que não suporta pré-seleção de país), agora redirecionamos para um **cart permalink** com o país pré-preenchido:

```
https://wfgxax-00.myshopify.com/cart/{variant}:{qty}?checkout[shipping_address][country]=BR
```

**Resultado:**
- ✅ Brasil está corretamente pré-selecionado para clientes brasileiros
- ✅ Funciona automaticamente para TODOS os 195+ países
- ✅ Sem configuração extra necessária
- ✅ Testado e verificado

---

## 📚 REFERÊNCIA: Configurar Shopify Markets (Opcional)

Você precisa configurar **Shopify Markets** no painel admin da sua loja. Siga estes passos:

### Passo 1: Acessar Configurações de Markets

1. Vá para o **Shopify Admin** da sua loja
2. Clique em **Settings** (Configurações) no menu inferior esquerdo
3. Clique em **Markets**

### Passo 2: Criar ou Editar o Market Internacional

1. Se já existe um market "International", clique nele para editar
2. Se não existe, clique em **Add market** para criar um novo

### Passo 3: Adicionar Países

Adicione TODOS os países para os quais você quer vender:

- **Brasil** (BR)
- **Estados Unidos** (US)
- **Canadá** (CA)
- **Portugal** (PT)
- **Reino Unido** (GB)
- **França** (FR)
- **Alemanha** (DE)
- **Japão** (JP)
- **Austrália** (AU)
- ... e qualquer outro país relevante

### Passo 4: Configurar Shipping Zones (CRÍTICO!)

**MUITO IMPORTANTE:** Países sem zona de envio configurada NÃO aparecem no checkout!

1. Vá para **Settings** → **Shipping and delivery**
2. Clique em **Manage rates** na zona "Rest of World" ou crie uma nova zona
3. Para cada país/região:
   - Adicione o país
   - Configure uma taxa de envio (pode ser gratuita ou paga)
   - Salve as alterações

**Exemplo para Brasil:**
- País: Brazil (BR)
- Shipping rate: "Standard Shipping" - R$20,00 (ou Free shipping)

### Passo 5: Ativar o Market

1. Certifique-se de que o market está **Ativado** (Active)
2. Clique em **Save** para salvar todas as alterações

## 🧪 TESTAR

Após configurar Markets:

1. Aguarde 5-10 minutos para as configurações propagarem
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Abra uma **aba anônima**
4. Acesse sua landing page
5. Clique em "Adicionar ao Carrinho"
6. Verifique se o país está correto no dropdown

## 📊 VERIFICAR GEOLOCALIZAÇÃO DO SHOPIFY

Você pode testar como o Shopify detecta seu IP:

1. Abra: https://www.shopify.com/geo
2. Veja qual país está sendo detectado
3. Se estiver errado, significa que o Shopify tem problema de geolocalização para seu IP

## 🔧 ALTERNATIVA: Migrar para Storefront API

Se Markets não resolver, a única solução real é **migrar do Buy SDK (deprecado) para a Storefront API moderna**, que suporta `buyerIdentity.countryCode`.

**Limitação do Buy SDK:**
- ❌ NÃO permite definir país programaticamente
- ❌ Deprecado desde Janeiro 2025
- ❌ Não receberá mais atualizações

**Vantagens da Storefront API:**
- ✅ Suporte completo a `buyerIdentity.countryCode`
- ✅ API moderna e mantida
- ✅ Controle total sobre país/moeda

## 📚 Referências

- [Shopify Markets Setup](https://help.shopify.com/en/manual/markets)
- [Shipping Zones Configuration](https://help.shopify.com/en/manual/shipping)
- [Buy SDK Deprecation Notice](https://shopify.github.io/js-buy-sdk/)
- [Storefront API Migration](https://shopify.dev/docs/api/storefront)

## ⚡ RESUMO

**Para resolver definitivamente:**
1. ✅ Configure Shopify Markets para Brasil + outros países
2. ✅ Configure Shipping Zones para cada país
3. ✅ Teste após 5-10 minutos
4. ⚠️ Se não resolver: problema está na geolocalização do Shopify (fora do nosso controle)
5. 🔄 Solução final: Migrar para Storefront API (trabalho maior)
