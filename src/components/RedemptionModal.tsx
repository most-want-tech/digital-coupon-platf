import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Coupon, Business } from '@/lib/types';
import { QrCode, Copy, Check, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RedemptionModalProps {
  coupon: Coupon | null;
  business: Business | null;
  open: boolean;
  onClose: () => void;
  onConfirmRedeem: () => void;
}

export function RedemptionModal({ coupon, business, open, onClose, onConfirmRedeem }: RedemptionModalProps) {
  const [copied, setCopied] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  if (!coupon || !business) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.redemptionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    setRedeemed(true);
    setTimeout(() => {
      onConfirmRedeem();
      onClose();
      setRedeemed(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{coupon.title}</DialogTitle>
          <DialogDescription className="text-base">
            {business.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!redeemed ? (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-white p-6 rounded-xl mb-4">
                    <QrCode size={180} weight="regular" />
                  </div>
                  <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg">
                    <code className="font-mono font-semibold text-sm">
                      {coupon.redemptionCode}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-7 w-7"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-4"
                  >
                    <Check className="w-12 h-12 text-accent-foreground" weight="bold" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">¡Canjeado!</h3>
                  <p className="text-muted-foreground text-sm">Disfruta tu descuento</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <Badge className="bg-accent text-accent-foreground mb-3 text-sm px-3 py-1">
              {coupon.discount} DESCUENTO
            </Badge>
            <p className="text-sm text-foreground mb-4">
              {coupon.description}
            </p>
            <Separator className="my-4" />
            <div>
              <h4 className="font-semibold text-sm mb-2">Términos y Condiciones</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {coupon.terms}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Vence: {new Date(coupon.expiryDate).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {!redeemed && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleRedeem} className="flex-1 bg-accent hover:bg-accent/90">
                <Check className="w-4 h-4 mr-2" />
                Marcar como Usado
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
