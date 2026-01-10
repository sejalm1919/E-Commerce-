import { cn } from '@/lib/utils';
import { Bot, User, Star, ExternalLink, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { mockProducts } from '@/data/mockData';
import { toast } from 'sonner';
import type { ChatMessage as ChatMessageType } from '@/store/chatStore';

// Indian Rupee formatter with proper Indian number formatting
const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

interface ChatMessageProps {
  message: ChatMessageType;
  compact?: boolean;
}

export function ChatMessage({ message, compact = false }: ChatMessageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const isBot = message.role === 'bot';

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
      toast.success(t('common.addedToCart'));
    }
  };

  const handleNavigate = (href: string) => {
    if (href === '#cart') {
      // Trigger cart open - handled by parent
      return;
    }
    navigate(href);
  };

  const renderContent = () => {
    // User message or legacy text
    if (!isBot || !message.structuredContent) {
      return (
        <p className="whitespace-pre-wrap">
          {message.content || (message.structuredContent?.type === 'text' && t(message.structuredContent.message))}
        </p>
      );
    }

    const content = message.structuredContent;

    switch (content.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{t(content.message)}</p>;

      case 'product-list':
        return (
          <div className="space-y-3">
            <p className="font-medium">{t(content.title)}</p>
            <div className={cn(
              'grid gap-2',
              compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
            )}>
              {content.products.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {/* FIXED: Product price with INR formatting */}
                      <span className="text-xs font-bold text-primary">
                        {formatINR(product.price)}
                      </span>
                      {product.rating && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {product.rating}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs px-2"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {t('common.view')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs px-2"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {t('common.add')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'order-status':
        const order = content.order;
        const statusColors: Record<string, string> = {
          PENDING: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
          SHIPPED: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
          DELIVERED: 'bg-green-500/20 text-green-600 border-green-500/30',
        };
        return (
          <div className="space-y-2">
            <p className="font-medium">{t('chat.orderStatusTitle')}</p>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{order.orderId}</span>
                <Badge className={cn('text-xs', statusColors[order.status] || '')}>
                  {order.status}
                </Badge>
              </div>
              <div className="text-xs space-y-1">
                {order.items.map((item, idx) => (
                  <p key={idx}>
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-border/50">
                <span className="text-muted-foreground">
                  {format(new Date(order.createdDate), 'MMM d, yyyy')}
                </span>
                {/* FIXED: Order total with INR formatting */}
                <span className="font-medium">{formatINR(order.totalAmount)}</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-xs"
              onClick={() => navigate('/orders')}
            >
              {t('chat.viewAllOrders')}
            </Button>
          </div>
        );

      case 'help-links':
        return (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap">{t(content.message)}</p>
            <div className="flex flex-wrap gap-1">
              {content.items.map((item, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => handleNavigate(item.href)}
                >
                  {t(item.label)}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return <p>{message.content}</p>;
    }
  };

  const formattedTime = format(new Date(message.timestamp), 'h:mm a');

  return (
    <div
      className={cn(
        'flex gap-2 animate-fade-in',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          isBot
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
      </div>
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div
          className={cn(
            'rounded-2xl px-3 py-2 text-sm',
            isBot
              ? 'bg-card text-card-foreground border border-border'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {renderContent()}
        </div>
        <span className={cn(
          'text-[10px] text-muted-foreground px-1',
          !isBot && 'text-right'
        )}>
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
