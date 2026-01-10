// Enhanced Chatbot service with structured responses
import { mockProducts, mockOrders } from '@/data/mockData';
import type { ChatResponseContent, ProductSummary, OrderSummary } from '@/store/chatStore';

export interface ChatContext {
  currentRoute: string;
  isLoggedIn: boolean;
  cartItemsCount: number;
  language: 'en' | 'hi';
}

// Convert mock product to ProductSummary
function toProductSummary(product: typeof mockProducts[0]): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    rating: product.rating,
  };
}

// Convert mock order to OrderSummary
function toOrderSummary(order: typeof mockOrders[0]): OrderSummary {
  return {
    orderId: order.orderId,
    status: order.status,
    totalAmount: order.totalAmount,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    createdDate: order.createdDate,
    deliveredDate: order.deliveredDate,
    shippedDate: order.shippedDate,
  };
}

// Extract price limit from question
function extractPriceLimit(question: string): number | null {
  const patterns = [
    /under\s*[₹$]?\s*(\d+)/i,
    /below\s*[₹$]?\s*(\d+)/i,
    /less than\s*[₹$]?\s*(\d+)/i,
    /[₹$]\s*(\d+)\s*(or less|and below)/i,
  ];
  
  for (const pattern of patterns) {
    const match = question.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

// Main chatbot logic
export async function getBotReply(
  question: string,
  context: ChatContext
): Promise<ChatResponseContent> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400));

  const lowerQ = question.toLowerCase();
  const priceLimit = extractPriceLimit(lowerQ);

  // Greeting
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|नमस्ते)/i.test(lowerQ)) {
    return { type: 'text', message: 'chat.greeting' };
  }

  // Thank you
  if (/thank|thanks|धन्यवाद/i.test(lowerQ)) {
    return { type: 'text', message: 'chat.thanks' };
  }

  // Offers / discounts
  if (/offer|discount|deal|sale|coupon|छूट|ऑफर/i.test(lowerQ)) {
    const discountedProducts = mockProducts
      .filter((p) => p.rating && p.rating >= 4.5)
      .slice(0, 4)
      .map(toProductSummary);
    
    return {
      type: 'product-list',
      title: 'chat.topDeals',
      products: discountedProducts,
    };
  }

  // Track order / order status
  if (/order|track|status|ऑर्डर|ट्रैक/i.test(lowerQ) && /(track|status|where|last|recent|स्टेटस)/i.test(lowerQ)) {
    if (!context.isLoggedIn) {
      return {
        type: 'help-links',
        message: 'chat.loginForOrders',
        items: [
          { label: 'chat.loginButton', href: '/login' },
        ],
      };
    }
    
    const lastOrder = mockOrders[1]; // Get the shipped order for demo
    if (lastOrder) {
      return {
        type: 'order-status',
        order: toOrderSummary(lastOrder),
      };
    }
    return { type: 'text', message: 'chat.noOrders' };
  }

  // Cart / checkout help
  if (/cart|checkout|payment|pay|cod|कार्ट|चेकआउट|भुगतान/i.test(lowerQ)) {
    if (context.cartItemsCount === 0) {
      return { type: 'text', message: 'chat.emptyCart' };
    }
    return {
      type: 'help-links',
      message: 'chat.cartHelp',
      items: [
        { label: 'cart.checkout', href: '/checkout' },
        { label: 'nav.cart', href: '#cart' },
      ],
    };
  }

  // Shipping / delivery
  if (/shipping|delivery|deliver|time|arrive|डिलीवरी|शिपिंग/i.test(lowerQ)) {
    return { type: 'text', message: 'chat.faq.shipping' };
  }

  // Warranty / return / refund
  if (/warranty|return|refund|exchange|replace|वारंटी|रिटर्न|रिफंड/i.test(lowerQ)) {
    return { type: 'text', message: 'chat.faq.returns' };
  }

  // Payment methods
  if (/payment method|upi|card|credit|debit|भुगतान विधि/i.test(lowerQ)) {
    return { type: 'text', message: 'chat.faq.payment' };
  }

  // Electronics category
  if (/electronic|laptop|phone|headphone|watch|camera|tv|इलेक्ट्रॉनिक/i.test(lowerQ)) {
    let products = mockProducts.filter((p) => p.category === 'electronics');
    if (priceLimit) {
      products = products.filter((p) => p.price <= priceLimit);
    }
    const result = products.slice(0, 4).map(toProductSummary);
    
    if (result.length === 0) {
      return { type: 'text', message: 'chat.noProductsInRange' };
    }
    return {
      type: 'product-list',
      title: 'chat.electronicsTitle',
      products: result,
    };
  }

  // Fashion / clothing category
  if (/fashion|cloth|dress|shoe|sneaker|jacket|legging|chino|फैशन|कपड़े/i.test(lowerQ)) {
    let products = mockProducts.filter((p) => p.category === 'fashion');
    if (priceLimit) {
      products = products.filter((p) => p.price <= priceLimit);
    }
    const result = products.slice(0, 4).map(toProductSummary);
    
    if (result.length === 0) {
      return { type: 'text', message: 'chat.noProductsInRange' };
    }
    return {
      type: 'product-list',
      title: 'chat.fashionTitle',
      products: result,
    };
  }

  // Home / appliances
  if (/home|living|vacuum|chair|appliance|घर/i.test(lowerQ)) {
    let products = mockProducts.filter((p) => p.category === 'home');
    if (priceLimit) {
      products = products.filter((p) => p.price <= priceLimit);
    }
    const result = products.slice(0, 4).map(toProductSummary);
    
    if (result.length === 0) {
      return { type: 'text', message: 'chat.noProductsInRange' };
    }
    return {
      type: 'product-list',
      title: 'chat.homeTitle',
      products: result,
    };
  }

  // Gaming
  if (/gaming|playstation|ps5|xbox|गेमिंग/i.test(lowerQ)) {
    let products = mockProducts.filter((p) => p.category === 'gaming');
    if (priceLimit) {
      products = products.filter((p) => p.price <= priceLimit);
    }
    const result = products.slice(0, 4).map(toProductSummary);
    
    if (result.length === 0) {
      return { type: 'text', message: 'chat.noProductsInRange' };
    }
    return {
      type: 'product-list',
      title: 'chat.gamingTitle',
      products: result,
    };
  }

  // General product search with price
  if (priceLimit) {
    const products = mockProducts
      .filter((p) => p.price <= priceLimit)
      .slice(0, 4)
      .map(toProductSummary);
    
    if (products.length > 0) {
      return {
        type: 'product-list',
        title: 'chat.productsUnderPrice',
        products,
      };
    }
    return { type: 'text', message: 'chat.noProductsInRange' };
  }

  // Help / support
  if (/help|support|contact|assist|मदद|सपोर्ट/i.test(lowerQ)) {
    return {
      type: 'help-links',
      message: 'chat.helpMessage',
      items: [
        { label: 'footer.helpCenter', href: '/support' },
        { label: 'nav.orders', href: '/orders' },
        { label: 'footer.contactUs', href: '/contact' },
      ],
    };
  }

  // Fallback
  return {
    type: 'help-links',
    message: 'chat.fallback',
    items: [
      { label: 'nav.products', href: '/products' },
      { label: 'footer.helpCenter', href: '/support' },
      { label: 'footer.contactUs', href: '/contact' },
    ],
  };
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
