import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-dark/85 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`
              w-full ${sizes[size]} bg-card-dark border border-border-dark rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col text-left
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-dark/50 bg-card-dark/40">
              {title ? (
                <h3 className="font-display font-extrabold text-lg text-white">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl border border-border-dark bg-card-dark/30 text-text-dark-muted hover:text-text-dark hover:border-primary/40 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {children}
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
