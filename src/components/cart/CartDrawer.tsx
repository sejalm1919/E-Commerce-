import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Indian Rupee formatter with proper Indian number formatting
const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const CartDrawer = () => {
  const { t } = useTranslation();
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-card shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{t('cart.title')}</h2>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    {items.length} {t('cart.items')}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={closeCart}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground">{t('cart.empty')}</p>
                  <p className="text-sm text-muted-foreground">{t('cart.emptyDesc')}</p>
                  <Button onClick={() => { closeCart(); navigate('/products'); }} className="mt-2">
                    {t('cart.browse')}
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 py-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-4 rounded-lg border border-border bg-secondary/50 p-3"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-20 w-20 rounded-md object-cover"
                          />
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.productId)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {/* FIXED: Item price with INR formatting */}
                            <p className="text-sm font-semibold text-primary">
                              {formatINR(item.price)}
                            </p>
                            <div className="mt-auto flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="border-t border-border p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                        {/* FIXED: Subtotal with INR formatting */}
                        <span className="text-foreground">{formatINR(getTotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('cart.shipping')}</span>
                        <span className="text-success">{t('cart.free')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                        <span className="text-foreground">{t('cart.total')}</span>
                        {/* FIXED: Total with INR formatting */}
                        <span className="text-primary">{formatINR(getTotal())}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {t('cart.checkout')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="w-full"
                      >
                        {t('cart.clearCart')}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
