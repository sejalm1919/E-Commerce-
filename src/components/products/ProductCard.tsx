import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  rating: number;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  stock,
  category,
  imageUrl,
  rating,
}: ProductCardProps) => {
  const { addItem, openCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      imageUrl,
    });
    toast.success('Added to cart!', {
      description: name,
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist({
        id: crypto.randomUUID(),
        productId: id,
        name,
        price,
        imageUrl,
        rating,
      });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${id}`} className="block">
        <div className="group relative overflow-hidden rounded-xl border-2 border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Stock Badge */}
            {stock < 10 && stock > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-warning/90 px-2 py-1 text-xs font-medium text-warning-foreground">
                Only {stock} left
              </span>
            )}
            {stock === 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-destructive/90 px-2 py-1 text-xs font-medium text-destructive-foreground">
                Out of Stock
              </span>
            )}

            {/* Quick Actions */}
            <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                className={`h-9 w-9 rounded-full shadow-md transition-colors ${
                  inWishlist ? 'bg-destructive text-destructive-foreground' : 'bg-card/90 hover:bg-card'
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-background/90 to-transparent p-4 transition-transform group-hover:translate-y-0">
              <Button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <span className="tech-badge mb-2 inline-block">{category}</span>

            {/* Title */}
            <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </h3>

            {/* Rating */}
            <div className="mb-2 flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? 'fill-warning text-warning'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({rating})</span>
            </div>

            {/* NO FORMATTING - DIRECT PRICE */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ₹{Math.floor(price)}
              </span>

              {stock > 0 && (
                <span className="text-xs text-success">In Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
