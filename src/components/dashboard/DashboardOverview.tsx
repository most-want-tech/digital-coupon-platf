import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RouticketApiUsage, RouticketCoupon, RouticketStats } from '@/lib/types';
import {
  Eye,
  Tag,
  TrendUp,
  Users
} from '@phosphor-icons/react';

interface DashboardOverviewProps {
  isLoading: boolean;
  partnerName: string;
  apiUsage?: RouticketApiUsage;
  stats?: RouticketStats;
  coupons: RouticketCoupon[];
}

export function DashboardOverview({
  isLoading,
  partnerName,
  apiUsage,
  stats,
  coupons
}: DashboardOverviewProps) {
  const activeCoupons = coupons.filter((coupon) => coupon.status === 1);
  const inactiveCoupons = coupons.filter((coupon) => coupon.status !== 1);

  const totalCoupons = coupons.length;
  const totalViews = coupons.reduce((sum, coupon) => sum + (coupon.vistosx || 0), 0);
  const totalScans = coupons.reduce((sum, coupon) => sum + (coupon.scan || 0), 0);
  const totalUsed = coupons.reduce((sum, coupon) => sum + (coupon.usado || 0), 0);
  const averageViews = totalCoupons > 0 ? totalViews / totalCoupons : 0;
  const averageScans = totalCoupons > 0 ? totalScans / totalCoupons : 0;

  const findTopCoupon = (metric: 'vistosx' | 'scan' | 'usado') => {
    if (coupons.length === 0) return undefined;
    return coupons.reduce((top, current) => (current[metric] > (top?.[metric] ?? -Infinity) ? current : top), coupons[0]);
  };

  const statCards = [
    {
      title: 'Cupones del partner',
      value: totalCoupons,
      helper: `${activeCoupons.length} activos / ${inactiveCoupons.length} inactivos`,
      icon: Tag,
      color: 'text-blue-600'
    },
    {
      title: 'Vistas acumuladas',
      value: totalViews,
      helper: `${averageViews.toFixed(2)} en promedio`,
      icon: Eye,
      color: 'text-primary'
    },
    {
      title: 'Escaneos',
      value: totalScans,
      helper: `${totalUsed} usos reportados`,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Promedio general',
      value: averageScans.toFixed(2),
      helper: 'Actividad media por cupón',
      icon: TrendUp,
      color: 'text-purple-600'
    }
  ];

  const topSections = [
    {
      label: 'Más visto',
      coupon: findTopCoupon('vistosx'),
      valueLabel: (coupon?: RouticketCoupon) => `${coupon?.vistosx ?? 0} vistas` as string
    },
    {
      label: 'Más escaneado',
      coupon: findTopCoupon('scan'),
      valueLabel: (coupon?: RouticketCoupon) => `${coupon?.scan ?? 0} escaneos`
    },
    {
      label: 'Más usado',
      coupon: findTopCoupon('usado'),
      valueLabel: (coupon?: RouticketCoupon) => `${coupon?.usado ?? 0} usos`
    }
  ];

  const renderSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="space-y-2">
            <CardTitle className="h-4 bg-muted rounded" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-3/4" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {isLoading && !stats ? (
        renderSkeleton()
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} weight="duotone" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.helper}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Destacados para {partnerName}</CardTitle>
            <CardDescription>
              Datos consolidados directamente desde Routicket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {topSections.map(({ label, coupon: topCoupon, valueLabel }) => {
                if (!topCoupon || (topCoupon.vistosx === 0 && topCoupon.scan === 0 && topCoupon.usado === 0)) {
                  return (
                    <div key={label} className="rounded-lg border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                      <p className="font-medium mb-2">{label}</p>
                      <p>Sin datos disponibles</p>
                    </div>
                  );
                }
                return (
                  <div key={label} className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
                    <img
                      src={topCoupon.foto}
                      alt={topCoupon.titulo}
                      className="h-24 w-full rounded-md object-cover"
                    />
                    <div className="space-y-1">
                      <p className="font-semibold text-sm leading-tight">{topCoupon.titulo}</p>
                      <p className="text-xs text-muted-foreground">{valueLabel(topCoupon)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de la API</CardTitle>
            <CardDescription>Información en tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {apiUsage ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Clave pública</span>
                  <span className="font-mono text-xs">{apiUsage.api_public}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Llamadas actuales</span>
                  <span className="font-semibold">{apiUsage.contador}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Llamadas previas</span>
                  <span>{apiUsage.contador_prev}</span>
                </div>
                {stats && (
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Registros totales API</span>
                      <span className="font-medium text-foreground">{stats.records}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Bytes transferidos</span>
                      <span className="font-medium text-foreground">{stats.data_kb} KB</span>
                    </div>
                  </div>
                )}
                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                  {apiUsage.note}
                </div>
                {stats && (
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="block text-[11px] uppercase">Vistas (API)</span>
                      <span className="font-semibold text-foreground">{stats.totals.vistosx}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase">Escaneos (API)</span>
                      <span className="font-semibold text-foreground">{stats.totals.scan}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase">Likes (API)</span>
                      <span className="font-semibold text-foreground">{stats.totals.mg}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase">Comentarios (API)</span>
                      <span className="font-semibold text-foreground">{stats.totals.comentarios}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Sin información de uso disponible.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
