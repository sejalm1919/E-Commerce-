import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

// Indian Rupee formatter with proper Indian number formatting
const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
    removeItem(item.productId);
    toast.success('Moved to cart!', {
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">My Wishlist</h1>
            <p className="text-muted-foreground">{items.length} items saved</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Your wishlist is empty</h3>
            <p className="mb-6 text-muted-foreground">
              Save items you love for later
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-4"
              >
                <Link to={`/products/${item.productId}`} className="flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    {/* FIXED: Price with INR formatting */}
                    <p className="text-lg font-bold text-primary mt-1">
                      {formatINR(item.price)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-warning">★</span>
                      <span className="text-sm text-muted-foreground">{item.rating}</span>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Move to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeItem(item.productId);
                      toast.info('Removed from wishlist');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Wishlist;
