import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatPanel } from './ChatPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { useChatbot } from '@/hooks/useChatbot';

export function ChatWidget() {
  const { isOpen, setOpen } = useChatbot();

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && <ChatPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
}
