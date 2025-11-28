import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { RouticketCoupon } from '@/lib/types';
import { ArrowSquareOut, Clock, Eye, ListChecks } from '@phosphor-icons/react';

interface CouponManagementProps {
  isLoading: boolean;
  coupons: RouticketCoupon[];
}

const numberFormatter = new Intl.NumberFormat('es-MX');

const formatDate = (value: string) => {
  if (!value) return '—';
  const hasTime = value.includes(' ');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    ...(hasTime ? { timeStyle: 'short' } : {})
  }).format(date);
};

export function CouponManagement({ isLoading, coupons }: CouponManagementProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredCoupons = useMemo(() => {
    if (statusFilter === 'all') return coupons;
    if (statusFilter === 'active') return coupons.filter((coupon) => coupon.status === 1);
    return coupons.filter((coupon) => coupon.status !== 1);
  }, [coupons, statusFilter]);

  const loadingSkeleton = (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-6 space-y-4">
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-5 w-2/3 bg-muted rounded" />
            <div className="h-24 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cupones sincronizados</h2>
          <p className="text-muted-foreground">
            Vista consolidada de los cupones que la API devolvió para el partner seleccionado. No se permite edición desde esta vista.
          </p>
        </div>
        <div className="inline-flex rounded-md border bg-background p-1 text-sm">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Todos ({coupons.length})
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Activos ({coupons.filter((coupon) => coupon.status === 1).length})
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('inactive')}
          >
            Inactivos ({coupons.filter((coupon) => coupon.status !== 1).length})
          </Button>
        </div>
      </div>

      {isLoading ? (
        loadingSkeleton
      ) : filteredCoupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4" weight="duotone" />
            <h3 className="text-lg font-semibold mb-1">No se encontraron cupones</h3>
            <p className="text-sm">Prueba cambiando el filtro o vuelve a sincronizar la información.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCoupons.map((coupon) => {
            const isActive = coupon.status === 1;
            const buildRouticketViewLink = () => {
              const url = new URL('https://routicket.com/cupones/infoCupon.php');
              url.searchParams.set('id_cupon', String(coupon.id));
              return url.toString();
            };
            const routicketViewLink = buildRouticketViewLink();
            return (
              <Card key={coupon.id}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <img
                      src={coupon.foto}
                      alt={coupon.titulo}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Activo' : 'Inactivo'}</Badge>
                        <Badge variant="outline">ID #{coupon.id}</Badge>
                        <Badge variant="outline">Partner {coupon.id_partner}</Badge>
                        {coupon.id_empresa !== 0 && (
                          <Badge variant="outline">Empresa {coupon.id_empresa}</Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold leading-tight">{coupon.titulo}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{coupon.descripcion || coupon.condiciones}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3 text-sm">
                        <div className="rounded border bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">Vigencia</p>
                          <p className="font-medium">{formatDate(coupon.fecha_inicio)} → {formatDate(coupon.fecha_final)}</p>
                        </div>
                        <div className="rounded border bg-muted/40 p-3 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Vistas</p>
                            <p className="font-semibold">{numberFormatter.format(coupon.vistosx ?? 0)}</p>
                          </div>
                        </div>
                        <div className="rounded border bg-muted/40 p-3 flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Escaneos</p>
                            <p className="font-semibold">{numberFormatter.format(coupon.scan ?? 0)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-card/60 p-3 text-sm">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Condiciones</p>
                        <p>{coupon.condiciones || 'Sin restricciones adicionales registradas.'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {routicketViewLink && (
                          <Button asChild variant="outline" size="sm" className="gap-2">
                            <a href={routicketViewLink} target="_blank" rel="noopener noreferrer">
                              Ver en Routicket
                              <ArrowSquareOut className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {coupon.url_tienda && coupon.url_tienda !== '0' && (
                          <Button asChild variant="ghost" size="sm" className="gap-2">
                            <a href={coupon.url_tienda} target="_blank" rel="noopener noreferrer">
                              Sitio del negocio
                              <ArrowSquareOut className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-3 md:grid-cols-4 text-xs text-muted-foreground">
                        <div>
                          <span className="block text-[11px] uppercase">Likes</span>
                          <span className="font-semibold text-sm text-foreground">{numberFormatter.format(coupon.mg ?? 0)}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] uppercase">Comentarios</span>
                          <span className="font-semibold text-sm text-foreground">{numberFormatter.format(coupon.comentarios ?? 0)}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] uppercase">Código</span>
                          <span className="font-semibold text-sm text-foreground">{coupon.code || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] uppercase">Creado el</span>
                          <span className="font-semibold text-sm text-foreground">{formatDate(coupon.fecha_create)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
