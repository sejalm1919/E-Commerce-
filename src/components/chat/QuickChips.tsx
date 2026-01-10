import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface QuickChipsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const QUICK_QUESTIONS = [
  { key: 'chat.quick.offers', question: 'Show me today\'s best offers' },
  { key: 'chat.quick.electronics', question: 'Best deals in electronics' },
  { key: 'chat.quick.returns', question: 'What is the return policy?' },
  { key: 'chat.quick.trackOrder', question: 'Track my last order' },
  { key: 'chat.quick.under1000', question: 'Show products under $100' },
];

export function QuickChips({ onSelect, disabled }: QuickChipsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1.5 px-1">
      {QUICK_QUESTIONS.map((item) => (
        <Button
          key={item.key}
          size="sm"
          variant="outline"
          disabled={disabled}
          className="h-7 text-xs rounded-full bg-secondary/50 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-colors"
          onClick={() => onSelect(item.question)}
        >
          {t(item.key)}
        </Button>
      ))}
    </div>
  );
}
