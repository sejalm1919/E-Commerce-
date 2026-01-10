import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, DollarSign, Settings, ToggleLeft, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload, ImageFile } from './ImageUpload';
import { mockCategories } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  shortDescription: z.string().min(1, 'Short description is required').max(500),
  description: z.string().max(2000).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().max(100).optional(),
  price: z.number().positive('Price must be positive'),
  discountPercent: z.number().min(0).max(90).optional(),
  stock: z.number().int().min(0, 'Stock must be 0 or more'),
  sku: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  weight: z.string().max(50).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AdminProductFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ProductFormData>;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminProductForm = ({ mode, initialData, onSuccess, onCancel }: AdminProductFormProps) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      brand: '',
      price: 0,
      discountPercent: 0,
      stock: 0,
      sku: '',
      color: '',
      size: '',
      weight: '',
      status: 'ACTIVE',
      featured: false,
      ...initialData,
    },
  });

  const price = watch('price') || 0;
  const discountPercent = watch('discountPercent') || 0;
  const status = watch('status');
  const featured = watch('featured');

  const finalPrice = useMemo(() => {
    if (discountPercent > 0) {
      return price * (1 - discountPercent / 100);
    }
    return price;
  }, [price, discountPercent]);

  const onSubmit = async (data: ProductFormData) => {
    // Validate images
    if (images.length === 0) {
      toast.error(t('admin.form.imageRequired', 'At least one product image is required'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - in production, this would:
      // 1. Upload images to /api/admin/uploads
      // 2. Create product with /api/admin/products
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const productData = {
        ...data,
        imageUrls: images.map((img) => img.preview), // In production, these would be uploaded URLs
      };
      
      console.log('Creating product:', productData);
      
      toast.success(t('admin.form.productCreated', 'Product created successfully'));
      onSuccess();
    } catch (error) {
      toast.error(t('admin.form.createFailed', 'Failed to create product. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border">
      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <SectionHeader icon={Package} title={t('admin.form.basicInfo', 'Basic Information')} />
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">{t('admin.form.productName', 'Product Name')} *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={t('admin.form.productNamePlaceholder', 'Enter product name')}
              className={cn("mt-1.5", errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="shortDescription">{t('admin.form.shortDescription', 'Short Description')} *</Label>
            <Textarea
              id="shortDescription"
              {...register('shortDescription')}
              placeholder={t('admin.form.shortDescPlaceholder', 'Brief product description (shown in listings)')}
              rows={2}
              className={cn("mt-1.5", errors.shortDescription && "border-destructive")}
            />
            {errors.shortDescription && <p className="text-sm text-destructive mt-1">{errors.shortDescription.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">{t('admin.form.detailedDescription', 'Detailed Description')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('admin.form.detailedDescPlaceholder', 'Full product description with features')}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>{t('admin.form.category', 'Category')} *</Label>
            <Select
              value={watch('categoryId')}
              onValueChange={(value) => setValue('categoryId', value)}
            >
              <SelectTrigger className={cn("mt-1.5", errors.categoryId && "border-destructive")}>
                <SelectValue placeholder={t('admin.form.selectCategory', 'Select category')} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <Label htmlFor="brand">{t('admin.form.brand', 'Brand')}</Label>
            <Input
              id="brand"
              {...register('brand')}
              placeholder={t('admin.form.brandPlaceholder', 'e.g., Apple, Samsung')}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <SectionHeader icon={DollarSign} title={t('admin.form.pricingStock', 'Pricing & Stock')} />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="price">{t('admin.form.price', 'Price')} ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
              className={cn("mt-1.5", errors.price && "border-destructive")}
            />
            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="discountPercent">{t('admin.form.discount', 'Discount')} (%)</Label>
            <Input
              id="discountPercent"
              type="number"
              min="0"
              max="90"
              {...register('discountPercent', { valueAsNumber: true })}
              placeholder="0"
              className={cn("mt-1.5", errors.discountPercent && "border-destructive")}
            />
            {errors.discountPercent && <p className="text-sm text-destructive mt-1">{errors.discountPercent.message}</p>}
          </div>

          <div>
            <Label>{t('admin.form.finalPrice', 'Final Price')}</Label>
            <div className="mt-1.5 h-10 px-3 rounded-md border border-border bg-muted/50 flex items-center">
              <span className="text-lg font-semibold text-primary">${finalPrice.toFixed(2)}</span>
              {discountPercent > 0 && (
                <span className="ml-2 text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="stock">{t('admin.form.stock', 'Stock Quantity')} *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              {...register('stock', { valueAsNumber: true })}
              placeholder="0"
              className={cn("mt-1.5", errors.stock && "border-destructive")}
            />
            {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
          </div>

          <div>
            <Label htmlFor="sku">{t('admin.form.sku', 'SKU / Product Code')}</Label>
            <Input
              id="sku"
              {...register('sku')}
              placeholder="e.g., PROD-001"
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Attributes Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <SectionHeader icon={Settings} title={t('admin.form.attributes', 'Attributes')} />
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="color">{t('admin.form.color', 'Color')}</Label>
            <Input
              id="color"
              {...register('color')}
              placeholder={t('admin.form.colorPlaceholder', 'e.g., Black, Red')}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="size">{t('admin.form.size', 'Size')}</Label>
            <Input
              id="size"
              {...register('size')}
              placeholder={t('admin.form.sizePlaceholder', 'e.g., S, M, L, XL')}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="weight">{t('admin.form.weight', 'Weight / Volume')}</Label>
            <Input
              id="weight"
              {...register('weight')}
              placeholder={t('admin.form.weightPlaceholder', 'e.g., 500g, 1kg')}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <SectionHeader icon={ToggleLeft} title={t('admin.form.status', 'Status')} />
        
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <Label>{t('admin.form.productStatus', 'Product Status')}</Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {status === 'ACTIVE' 
                  ? t('admin.form.activeDesc', 'Product is visible to customers')
                  : t('admin.form.inactiveDesc', 'Product is hidden from customers')
                }
              </p>
            </div>
            <Switch
              checked={status === 'ACTIVE'}
              onCheckedChange={(checked) => setValue('status', checked ? 'ACTIVE' : 'INACTIVE')}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <Label>{t('admin.form.featured', 'Featured Product')}</Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t('admin.form.featuredDesc', 'Show on home page featured section')}
              </p>
            </div>
            <Switch
              checked={featured}
              onCheckedChange={(checked) => setValue('featured', checked)}
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <SectionHeader icon={ImageIcon} title={t('admin.form.productImages', 'Product Images')} />
        <ImageUpload
          images={images}
          onChange={setImages}
          maxImages={5}
          error={images.length === 0 ? undefined : undefined}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('admin.form.saving', 'Saving...')}
            </>
          ) : (
            t('admin.form.saveProduct', 'Save Product')
          )}
        </Button>
      </div>
    </form>
  );
};
