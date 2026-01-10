import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, ArrowLeft, HelpCircle, Package, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { QuickChips } from '@/components/chat/QuickChips';
import { useChatbot } from '@/hooks/useChatbot';

const FAQ_TOPICS = [
  { key: 'chat.faqTopics.shipping', icon: Truck, question: 'What is the shipping policy?' },
  { key: 'chat.faqTopics.returns', icon: RotateCcw, question: 'What is the return policy?' },
  { key: 'chat.faqTopics.payment', icon: CreditCard, question: 'What payment methods do you accept?' },
  { key: 'chat.faqTopics.orders', icon: Package, question: 'How can I track my order?' },
];

export default function SupportChat() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleQuickSelect = (question: string) => {
    sendMessage(question);
  };

  const handleFAQClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label={t('common.back')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">{t('chat.pageTitle')}</h1>
              <p className="text-xs text-muted-foreground">{t('chat.subtitle')}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('chat.clear')}
          </Button>
        </div>
      </header>

      <div className="container py-4">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* FAQ Sidebar - Desktop */}
          <aside className="hidden lg:block space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">{t('chat.faqTitle')}</h2>
              </div>
              <div className="space-y-2">
                {FAQ_TOPICS.map((topic) => (
                  <button
                    key={topic.key}
                    onClick={() => handleFAQClick(topic.question)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm hover:bg-secondary transition-colors group"
                  >
                    <topic.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{t(topic.key)}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-medium mb-2">{t('chat.needMoreHelp')}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t('chat.contactSupport')}</p>
              <Button variant="outline" size="sm" className="w-full">
                {t('footer.contactUs')}
              </Button>
            </div>
          </aside>

          {/* Chat Area */}
          <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} compact={false} />
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <span className="text-sm font-bold">N</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl bg-secondary border border-border px-4 py-3">
                      <span className="text-xs text-muted-foreground mr-2">{t('chat.typing')}</span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick chips */}
            <div className="border-t border-border py-3 px-4 bg-secondary/30">
              <QuickChips onSelect={handleQuickSelect} disabled={isLoading} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-background">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('chat.fullPagePlaceholder')}
                  className="flex-1 h-11 bg-secondary border-border focus:border-primary"
                  disabled={isLoading}
                  aria-label={t('chat.placeholder')}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-label={t('chat.send')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t('chat.send')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
