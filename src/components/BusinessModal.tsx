import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Business, Coupon } from '@/lib/types';
import { MapPin, Clock, Phone, Tag } from '@phosphor-icons/react';

interface BusinessModalProps {
  business: Business | null;
  coupons: Coupon[];
  open: boolean;
  onClose: () => void;
  onCouponClick: (coupon: Coupon) => void;
}

const categoryLabels = {
  food: 'Comida y Restaurantes',
  retail: 'Tiendas',
  services: 'Servicios',
  entertainment: 'Entretenimiento'
};

export function BusinessModal({ business, coupons, open, onClose, onCouponClick }: BusinessModalProps) {
  if (!business) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={business.coverImage} 
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
              <AvatarImage src={business.logo} alt={business.name} />
            </Avatar>
            <div>
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl text-white mb-1">
                  {business.name}
                </DialogTitle>
              </DialogHeader>
              <Badge variant="secondary" className="mt-1">
                {categoryLabels[business.category]}
              </Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-12rem)]">
          <div className="p-6 space-y-6">
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {business.description}
              </p>
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">{business.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Horario</p>
                  <p className="text-sm text-muted-foreground">{business.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{business.phone}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Cupones Disponibles ({coupons.length})
              </h3>
              <div className="grid gap-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    onClick={() => onCouponClick(coupon)}
                    className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer group"
                  >
                    <img
                      src={coupon.image}
                      alt={coupon.title}
                      className="w-24 h-24 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <Badge className="bg-accent text-accent-foreground shrink-0">
                          {coupon.discount}
                        </Badge>
                        {coupon.isNew && (
                          <Badge variant="secondary" className="shrink-0">NUEVO</Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {coupon.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {coupon.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
