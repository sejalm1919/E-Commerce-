import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Response types for structured bot messages
export type ProductSummary = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating?: number;
};

export type OrderSummary = {
  orderId: string;
  status: string;
  totalAmount: number;
  items: { name: string; quantity: number }[];
  createdDate: string;
  deliveredDate?: string;
  shippedDate?: string;
};

export type HelpLink = {
  label: string;
  href: string;
};

export type ChatResponseContent =
  | { type: 'text'; message: string }
  | { type: 'product-list'; title: string; products: ProductSummary[] }
  | { type: 'order-status'; order: OrderSummary }
  | { type: 'help-links'; message: string; items: HelpLink[] };

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  structuredContent?: ChatResponseContent;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: '',
  structuredContent: {
    type: 'text',
    message: 'chat.welcome',
  },
  timestamp: new Date(),
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [INITIAL_MESSAGE],
      isLoading: false,
      isOpen: false,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      setLoading: (loading) => set({ isLoading: loading }),
      setOpen: (open) => set({ isOpen: open }),
      clearMessages: () => set({ messages: [INITIAL_MESSAGE] }),
    }),
    {
      name: 'nexmart-chat-storage',
      partialize: (state) => ({
        messages: state.messages.map((m) => ({
          ...m,
          timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.messages = state.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        }
      },
    }
  )
);

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
