declare global {
  interface Window {
    ShopifyBuy?: any;
    shopifyUI?: any;
    shopifyCart?: any;
  }
}

const SHOPIFY_CONFIG = {
  domain: 'wfgxax-00.myshopify.com',
  storefrontAccessToken: '0b635f4e01575574fca675f598cd3275',
  collectionId: 'gid://shopify/Collection/299929894991',
};

export const PRODUCT_IDS = {
  ADVENT_CALENDAR: '43542124331087',
  KERASTASE_KIT: '43542113255503',
};

let isShopifyInitialized = false;
let shopifyInitPromise: Promise<void> | null = null;

export const initializeShopifyUI = (): Promise<void> => {
  if (shopifyInitPromise) {
    return shopifyInitPromise;
  }

  if (isShopifyInitialized && window.shopifyUI) {
    return Promise.resolve();
  }

  shopifyInitPromise = new Promise((resolve, reject) => {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      initializeUI();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.async = true;
    
    script.onload = () => {
      initializeUI();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Shopify SDK'));
    };
    
    document.head.appendChild(script);

    function initializeUI() {
      try {
        if (!window.ShopifyBuy) {
          throw new Error('ShopifyBuy not available');
        }

        const client = window.ShopifyBuy.buildClient({
          domain: SHOPIFY_CONFIG.domain,
          storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
        });

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          window.shopifyUI = ui;
          
          ui.createComponent('cart', {
            options: {
              cart: {
                iframe: false,
                popup: false,
                startOpen: false,
                styles: {
                  cart: {
                    display: 'none'
                  }
                }
              }
            }
          });

          isShopifyInitialized = true;
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    }
  });

  return shopifyInitPromise;
};

export const addToShopifyCart = async (variantId: string, quantity: number): Promise<void> => {
  try {
    await initializeShopifyUI();
    
    if (!window.shopifyUI) {
      throw new Error('Shopify UI not initialized');
    }

    const client = window.ShopifyBuy.buildClient({
      domain: SHOPIFY_CONFIG.domain,
      storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
    });

    const product = await client.product.fetch(variantId);
    const variant = product.variants[0];
    
    await window.shopifyUI.createCart();
    await window.shopifyUI.cart.addVariantToCart(variant, quantity);
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    throw error;
  }
};

let collectionProducts: any[] | null = null;

export const getCollectionProducts = async (): Promise<any[]> => {
  if (collectionProducts) {
    return collectionProducts;
  }

  try {
    await initializeShopifyUI();

    if (!window.ShopifyBuy) {
      throw new Error('Shopify SDK not loaded');
    }

    const client = window.ShopifyBuy.buildClient({
      domain: SHOPIFY_CONFIG.domain,
      storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
    });

    const collection = await client.collection.fetchWithProducts(
      SHOPIFY_CONFIG.collectionId,
      { productsFirst: 250 }
    );
    
    collectionProducts = collection.products;
    return collectionProducts!;
  } catch (error) {
    console.error('Erro ao buscar cole\u00e7\u00e3o:', error);
    throw error;
  }
};

function extractNumericId(gid: string): string {
  const match = gid.match(/\/(\d+)$/);
  return match ? match[1] : gid;
}

export const goToShopifyCheckout = async (
  adventCalendarQuantity: number,
  includeKerastaseKit: boolean,
  _countryCode?: string | null,
  _userLanguage?: string | null
): Promise<void> => {
  try {
    const cartItems = [];
    
    cartItems.push(`${PRODUCT_IDS.ADVENT_CALENDAR}:${adventCalendarQuantity}`);
    
    if (includeKerastaseKit) {
      cartItems.push(`${PRODUCT_IDS.KERASTASE_KIT}:1`);
    }
    
    const cartPath = cartItems.join(',');
    const params = new URLSearchParams();
    
    params.append('checkout[shipping_address][country]', 'BR');
    params.append('locale', 'pt-BR');
    params.append('currency', 'BRL');
    
    const checkoutUrl = `https://${SHOPIFY_CONFIG.domain}/cart/${cartPath}?${params.toString()}`;
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    alert('Erro ao criar checkout. Por favor, tente novamente.');
    throw error;
  }
};

export const clearShopifyCart = async (): Promise<void> => {
  try {
    await initializeShopifyUI();
    
    if (window.shopifyUI && window.shopifyUI.cart) {
      await window.shopifyUI.cart.clearLineItems();
    }
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
  }
};

export interface ShopifyCartItem {
  variantId: string;
  quantity: number;
}

export const goToShopifyCheckoutWithItems = async (
  items: ShopifyCartItem[],
  includeKerastaseKit: boolean,
  _countryCode?: string | null,
  _userLanguage?: string | null
): Promise<void> => {
  try {
    const cartItems: string[] = [];
    
    items.forEach(item => {
      cartItems.push(`${item.variantId}:${item.quantity}`);
    });
    
    if (includeKerastaseKit) {
      cartItems.push(`${PRODUCT_IDS.KERASTASE_KIT}:1`);
    }
    
    const cartPath = cartItems.join(',');
    const params = new URLSearchParams();
    
    params.append('checkout[shipping_address][country]', 'BR');
    params.append('locale', 'pt-BR');
    params.append('currency', 'BRL');
    
    const checkoutUrl = `https://${SHOPIFY_CONFIG.domain}/cart/${cartPath}?${params.toString()}`;
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    alert('Erro ao criar checkout. Por favor, tente novamente.');
    throw error;
  }
};
