import { User, Mail, Package, Heart, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CartDrawer />
        <main className="container mx-auto px-4 py-16 text-center">
          <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view profile</h1>
          <p className="text-muted-foreground mb-6">Access your account settings and order history</p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', description: 'Track and view order history', to: '/orders' },
    { icon: Heart, label: 'Wishlist', description: `${wishlistItems.length} items saved`, to: '/wishlist' },
    { icon: Settings, label: 'Account Settings', description: 'Manage your preferences', to: '#' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground">{user?.username}</h1>
              <p className="flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              {user?.role === 'ADMIN' && (
                <span className="mt-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                  Admin
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{wishlistItems.length}</p>
            <p className="text-sm text-muted-foreground">Wishlist Items</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{cartItems.length}</p>
            <p className="text-sm text-muted-foreground">Cart Items</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-3xl font-bold text-success">$4,499</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
        </motion.div> */}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="flex items-center gap-4 rounded-xl border border-primary/50 bg-primary/10 p-4 transition-colors hover:bg-primary/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Admin Dashboard</p>
                <p className="text-sm text-muted-foreground">Manage products, orders & analytics</p>
              </div>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 transition-colors hover:bg-destructive/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/20">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-destructive">Sign Out</p>
              <p className="text-sm text-muted-foreground">Log out of your account</p>
            </div>
          </button>
        </motion.div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Profile;
