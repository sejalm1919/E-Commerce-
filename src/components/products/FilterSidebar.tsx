import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCategories, mockGenderFilters } from '@/data/mockData';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Indian Rupee formatter with proper Indian number formatting
const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedGenders: string[];
  onGenderChange: (genders: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

export const FilterSidebar = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedGenders,
  onGenderChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handleGenderToggle = (genderId: string) => {
    if (selectedGenders.includes(genderId)) {
      onGenderChange(selectedGenders.filter((g) => g !== genderId));
    } else {
      onGenderChange([...selectedGenders, genderId]);
    }
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedGenders.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500000 || // Updated for INR range
    minRating > 0;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('filters.search')}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('filters.categories')}</h3>
        <div className="space-y-2">
          {mockCategories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <span className="text-xl">{category.icon}</span>
              <span className="flex-1 text-sm text-foreground">{category.name}</span>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('filters.shopFor')}</h3>
        <div className="space-y-2">
          {mockGenderFilters.map((gender) => (
            <label
              key={gender.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <Checkbox
                checked={selectedGenders.includes(gender.id)}
                onCheckedChange={() => handleGenderToggle(gender.id)}
              />
              <span className="text-xl">{gender.icon}</span>
              <span className="flex-1 text-sm text-foreground">{gender.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range - FIXED WITH INR */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('filters.priceRange')}</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            min={0}
            max={500000}  // Updated for INR max price
            step={5000}   // Updated step for INR
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
          {/* FIXED: Price labels with INR formatting */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatINR(priceRange[0])}</span>
            <span className="text-muted-foreground">{formatINR(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('filters.minimumRating')}</h3>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMinRatingChange(rating)}
              className={minRating === rating ? 'bg-primary text-primary-foreground' : ''}
            >
              {rating === 0 ? t('filters.all') : `${rating}+`}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          {t('filters.clearFilters')}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t('filters.title')}</h2>
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Button & Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="lg:hidden fixed bottom-24 right-4 z-50 rounded-full shadow-lg"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('filters.title')}
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-card border-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              {t('filters.title')}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
