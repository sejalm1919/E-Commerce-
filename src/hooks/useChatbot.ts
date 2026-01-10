import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useChatStore, generateMessageId, type ChatMessage } from '@/store/chatStore';
import { getBotReply, type ChatContext } from '@/services/chatbotService';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export function useChatbot() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { user } = useAuthStore();
  const { items } = useCartStore();
  
  const {
    messages,
    isLoading,
    isOpen,
    addMessage,
    setLoading,
    setOpen,
    clearMessages,
  } = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      const context: ChatContext = {
        currentRoute: location.pathname,
        isLoggedIn: !!user,
        cartItemsCount: items.length,
        language: (i18n.language as 'en' | 'hi') || 'en',
      };

      const response = await getBotReply(content, context);
      
      const botMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'bot',
        content: '',
        structuredContent: response,
        timestamp: new Date(),
      };
      
      addMessage(botMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'bot',
        content: '',
        structuredContent: {
          type: 'text',
          message: 'chat.error',
        },
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isLoading, location.pathname, user, items.length, i18n.language, addMessage, setLoading]);

  return {
    messages,
    isLoading,
    isOpen,
    sendMessage,
    setOpen,
    clearMessages,
  };
}
