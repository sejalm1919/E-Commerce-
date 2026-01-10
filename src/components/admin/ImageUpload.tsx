import { useState, useRef, useCallback } from 'react';
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ImageUploadProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  error?: string;
}

export const ImageUpload = ({ images, onChange, maxImages = 5, error }: ImageUploadProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newImages: ImageFile[] = [];
    const remainingSlots = maxImages - images.length;
    
    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          isPrimary: images.length === 0 && newImages.length === 0, // First image is primary
        });
      }
    });
    
    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  }, [images, maxImages, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    // If removed image was primary, make first remaining image primary
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const setPrimary = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-border hover:border-primary/50",
          error && "border-destructive"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              {t('admin.form.dropImages', 'Drag & drop images here')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('admin.form.orBrowse', 'or click to browse files')}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= maxImages}
          >
            {t('admin.form.browseFiles', 'Browse Files')}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t('admin.form.maxImages', { count: maxImages, defaultValue: `Maximum ${maxImages} images` })}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={cn(
                "relative group rounded-xl overflow-hidden border-2 transition-all",
                image.isPrimary ? "border-primary ring-2 ring-primary/30" : "border-border"
              )}
            >
              <div className="aspect-square">
                <img
                  src={image.preview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {t('admin.form.primary', 'Primary')}
                </div>
              )}
              
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => setPrimary(image.id)}
                    title={t('admin.form.setAsPrimary', 'Set as primary')}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeImage(image.id)}
                  title={t('admin.form.removeImage', 'Remove image')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export type { ImageFile };
