import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

const statusConfig = {
  PENDING: { icon: Clock, color: 'bg-warning/20 text-warning border-warning/30', label: 'Pending' },
  SHIPPED: { icon: Truck, color: 'bg-primary/20 text-primary border-primary/30', label: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'bg-success/20 text-success border-success/30', label: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'bg-destructive/20 text-destructive border-destructive/30', label: 'Cancelled' },
};

const Orders = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartDrawer />
        <main className="container mx-auto px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view orders</h1>
          <p className="text-muted-foreground mb-6">Track your orders and view order history</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">My Orders</h1>
          <p className="text-muted-foreground">{mockOrders.length} orders</p>
        </div>

        {mockOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">No orders yet</h3>
            <p className="mb-6 text-muted-foreground">Start shopping to see your orders here</p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order, index) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={status.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                      <span className="text-lg font-bold text-primary">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-foreground">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between bg-secondary/30 px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                      {order.status === 'DELIVERED' && order.deliveredDate && (
                        <span>Delivered on {new Date(order.deliveredDate).toLocaleDateString()}</span>
                      )}
                      {order.status === 'SHIPPED' && order.shippedDate && (
                        <span>Shipped on {new Date(order.shippedDate).toLocaleDateString()}</span>
                      )}
                      {order.status === 'PENDING' && (
                        <span>Processing your order...</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Orders;
