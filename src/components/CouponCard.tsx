import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Coupon, Business } from '@/lib/types';
import { Heart, Tag, Clock } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface CouponCardProps {
  coupon: Coupon;
  business: Business;
  isSaved: boolean;
  isRedeemed: boolean;
  onToggleSave: () => void;
  onRedeem: () => void;
}

export function CouponCard({ 
  coupon, 
  business, 
  isSaved, 
  isRedeemed,
  onToggleSave, 
  onRedeem 
}: CouponCardProps) {
  const expiryDate = new Date(coupon.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-200">
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <img 
            src={coupon.image} 
            alt={coupon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-accent text-accent-foreground font-semibold shadow-lg">
              <Tag className="w-3 h-3 mr-1" weight="fill" />
              {coupon.discount}
            </Badge>
            {coupon.isNew && (
              <Badge variant="secondary" className="shadow-lg font-semibold">
                NUEVO
              </Badge>
            )}
            {isRedeemed && (
              <Badge variant="outline" className="bg-background/90 shadow-lg font-semibold">
                USADO
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          >
            <Heart 
              className="w-4 h-4" 
              weight={isSaved ? 'fill' : 'regular'}
              color={isSaved ? '#f59e0b' : 'currentColor'}
            />
          </Button>
          <div className="absolute bottom-3 left-3">
            <Avatar className="w-10 h-10 border-2 border-background shadow-lg">
              <AvatarImage src={business.logo} alt={business.name} />
            </Avatar>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
                {coupon.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {business.name}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {coupon.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className={isExpiringSoon ? 'text-accent font-medium' : ''}>
                Vence {expiryDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onRedeem();
              }}
              disabled={isRedeemed}
            >
              {isRedeemed ? 'Canjeado' : 'Canjear'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
