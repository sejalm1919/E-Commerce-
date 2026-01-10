import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ProductCard } from '@/components/products/ProductCard';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { mockProducts } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const Products = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialSearch = searchParams.get('search');

  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]); 
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');

  // Keep local filter state in sync with URL params (e.g., Home hero search)
  useEffect(() => {
    const nextSearch = searchParams.get('search') ?? '';
    const nextCategory = searchParams.get('category');

    setSearchQuery((prev) => (prev === nextSearch ? prev : nextSearch));

    setSelectedCategories((prev) => {
      const next = nextCategory ? [nextCategory] : [];
      return prev.length === next.length && prev[0] === next[0] ? prev : next;
    });
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Search filter
    const q = normalizeText(searchQuery);
    if (q) {
      products = products.filter((p) => {
        const haystacks = [
          normalizeText(p.name),
          normalizeText(p.description),
          normalizeText(p.category),
          normalizeText(p.gender),
        ];
        return haystacks.some((h) => h.includes(q));
      });
    }

    // Category filter
    if (selectedCategories.length > 0) {
      products = products.filter((p) => selectedCategories.includes(p.category));
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      products = products.filter((p) => selectedGenders.includes(p.gender));
    }

    // Price filter
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      products = products.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [searchQuery, selectedCategories, selectedGenders, priceRange, minRating, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedGenders([]);
    setPriceRange([0, 500000]); // Updated for INR
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {selectedCategories.length === 1
              ? mockProducts.find((p) => p.category === selectedCategories[0])?.category
                  .charAt(0)
                  .toUpperCase() +
                mockProducts.find((p) => p.category === selectedCategories[0])?.category.slice(1)
              : t('products.title')}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {t('products.productsFound')}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedGenders={selectedGenders}
            onGenderChange={setSelectedGenders}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            onClearFilters={handleClearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground hidden sm:block">
                {t('products.showing')} {filteredProducts.length} {t('nav.products').toLowerCase()}          
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('filters.sortBy')}:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="featured">{t('filters.featured')}</SelectItem>
                    <SelectItem value="price-asc">{t('filters.priceLowHigh')}</SelectItem>
                    <SelectItem value="price-desc">{t('filters.priceHighLow')}</SelectItem>
                    <SelectItem value="rating">{t('filters.highestRated')}</SelectItem>
                    <SelectItem value="name">{t('filters.nameAZ')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {t('products.noProducts')}
                </h3>
                <p className="text-muted-foreground">
                  {t('products.noProductsDesc')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Products;
