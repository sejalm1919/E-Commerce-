import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Zap, Shield, Truck, Headphones, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ProductPagination } from '@/components/ui/product-pagination';
import { mockProducts, mockCategories } from '@/data/mockData';

const PRODUCTS_PER_PAGE = 8;

const Index = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  });

  // const features = [
  //   { icon: Zap, title: t('features.fastDelivery'), description: t('features.fastDeliveryDesc') },
  //   { icon: Shield, title: t('features.securePayment'), description: t('features.securePaymentDesc') },
  //   { icon: Truck, title: t('features.freeShipping'), description: t('features.freeShippingDesc') },
  //   { icon: Headphones, title: t('features.support'), description: t('features.supportDesc') },
  // ];

  const features = [
  { icon: Zap, title: "Launching Q1 2026", description: "Premium e-commerce experience awaits" },
  { icon: Users, title: "Join Waitlist", description: "Get 10% off on launch day" },
  { icon: Shield, title: "Secure Payment", description: "Your transactions are safe and secure" },
  // { icon: Truck, title: "Free Shipping", description: "Free shipping on all orders" },
  { icon: Headphones, title: "Customer Support", description: "24/7 support for any questions" },
];


  const totalPages = Math.ceil(mockProducts.length / PRODUCTS_PER_PAGE);

  // Sync page with URL
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    if (page !== currentPage && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [searchParams, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', String(page));
    }
    setSearchParams(searchParams);
    // Scroll to featured products section
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return mockProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage]);

  const trendingProducts = mockProducts.slice(4, 8);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pb-20 md:pb-0">
        {/* Hero Section with Carousel */}
        <section className="relative overflow-hidden gradient-hero">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="tech-badge mb-4 inline-block">{t('home.newCollection')}</span>
                <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                  {t('home.heroTitle')}{' '}
                  <span className="text-gradient">{t('home.heroTitleHighlight')}</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  {t('home.heroDescription')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <HeroCarousel />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border bg-card/50 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="feature-icon">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('home.shopByCategory')}</h2>
                <p className="text-muted-foreground">{t('home.browseCollections')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {mockCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/products?category=${category.id}`}
                    className="group block"
                  >
                    <div className="phase-card flex flex-col items-center gap-3 text-center">
                      <div className="feature-icon text-2xl">{category.icon}</div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{category.count} {t('product.productsCount')}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured-products" className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('home.featuredProducts')}</h2>
                <p className="text-muted-foreground">{t('home.handpicked')}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/products">{t('home.viewAll')}</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            {totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 p-8 md:p-12"
            >
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  {t('home.ctaTitle')}
                </h2>
                <p className="mt-4 text-muted-foreground">
                  {t('home.ctaDescription')}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link to="/register">
                      {t('home.createAccount')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Trending */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('home.trendingNow')}</h2>
              <p className="text-muted-foreground">{t('home.popularThisWeek')}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <span className="text-xl font-bold text-primary-foreground">N</span>
                </div>
                <span className="text-xl font-bold">
                  Nex<span className="text-primary">Mart</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">{t('footer.shop')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/products" className="hover:text-primary">{t('footer.allProducts')}</Link></li>
                <li><Link to="/products?category=electronics" className="hover:text-primary">{t('footer.electronics')}</Link></li>
                <li><Link to="/products?category=fashion" className="hover:text-primary">{t('footer.fashion')}</Link></li>
                <li><Link to="/products?category=home" className="hover:text-primary">{t('footer.homeLiving')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">{t('footer.account')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-primary">{t('footer.login')}</Link></li>
                <li><Link to="/register" className="hover:text-primary">{t('footer.register')}</Link></li>
                <li><Link to="/orders" className="hover:text-primary">{t('footer.orders')}</Link></li>
                <li><Link to="/wishlist" className="hover:text-primary">{t('footer.wishlist')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t('footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-primary">{t('footer.shippingInfo')}</a></li>
                <li><a href="#" className="hover:text-primary">{t('footer.returns')}</a></li>
                <li><a href="#" className="hover:text-primary">{t('footer.contactUs')}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default Index;