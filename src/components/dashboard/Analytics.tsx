import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RouticketCoupon, RouticketStats } from '@/lib/types';
import {
  Calendar,
  ChartBar,
  ListChecks,
  TrendUp
} from '@phosphor-icons/react';

interface AnalyticsProps {
  isLoading: boolean;
  stats?: RouticketStats;
  coupons: RouticketCoupon[];
}

const numberFormatter = new Intl.NumberFormat('es-MX');

const formatDate = (value?: string) => {
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

export function Analytics({ isLoading, stats, coupons }: AnalyticsProps) {
  const totalCoupons = stats?.records ?? coupons.length;
  const totalViews = stats?.totals.vistosx ?? coupons.reduce((sum, coupon) => sum + (coupon.vistosx || 0), 0);
  const totalScans = stats?.totals.scan ?? coupons.reduce((sum, coupon) => sum + (coupon.scan || 0), 0);
  const averageViews = stats?.averages.vistosx ?? (coupons.length > 0 ? totalViews / coupons.length : 0);
  const averageScans = stats?.averages.scan ?? (coupons.length > 0 ? totalScans / coupons.length : 0);

  const statusEntries = Object.entries(stats?.by_status ?? {}).map(([status, count]) => ({
    status,
    count
  }));

  const tipoEntries = Object.entries(stats?.by_tipo ?? {}).map(([tipo, count]) => ({
    tipo,
    count
  }));

  const totals = stats?.totals;
  const averages = stats?.averages;
  const dates = stats?.dates;

  if (!stats && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay datos de analítica disponibles</CardTitle>
          <CardDescription>Sincroniza nuevamente para mostrar la información del API.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Analítica del Partner</h2>
        <p className="text-muted-foreground">
          Visualiza el rendimiento agregado de los cupones con la información provista por Routicket.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-sm font-medium">Registros totales</CardTitle>
            <TrendUp className="w-5 h-5 text-primary" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{numberFormatter.format(totalCoupons)}</div>
            <p className="text-xs text-muted-foreground mt-1">Cupones recuperados desde la API</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-sm font-medium">Vistas acumuladas</CardTitle>
            <ChartBar className="w-5 h-5 text-blue-600" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{numberFormatter.format(totalViews)}</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio {averageViews.toFixed(2)} por cupón</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-sm font-medium">Escaneos registrados</CardTitle>
            <ListChecks className="w-5 h-5 text-green-600" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{numberFormatter.format(totalScans)}</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio {averageScans.toFixed(2)} por cupón</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-sm font-medium">Reacciones</CardTitle>
            <TrendUp className="w-5 h-5 text-purple-600" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{numberFormatter.format(totals?.mg ?? 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Comentarios: {numberFormatter.format(totals?.comentarios ?? 0)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por estado</CardTitle>
            <CardDescription>Cupones activos vs. inactivos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusEntries.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin datos de estado disponibles.</p>
            )}
            {statusEntries.map(({ status, count }) => {
              const statusLabel = status === '1' ? 'Activos' : 'Inactivos';
              const percentage = totalCoupons > 0 ? (Number(count) / totalCoupons) * 100 : 0;

              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{statusLabel}</span>
                    <span className="text-muted-foreground">{numberFormatter.format(count)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fechas relevantes</CardTitle>
            <CardDescription>Rango de vigencia global</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Primera fecha de inicio</span>
              <span>{formatDate(dates?.min_fecha_inicio)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Última fecha de fin</span>
              <span>{formatDate(dates?.max_fecha_final)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Primer registro</span>
              <span>{formatDate(dates?.min_fecha_create)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Último registro</span>
              <span>{formatDate(dates?.max_fecha_create)}</span>
            </div>
            <p className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Las fechas se muestran tal como las expone la API, ajustadas al huso horario del navegador.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Actividad por tipo</CardTitle>
            <CardDescription>Clasificación directa desde Routicket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tipoEntries.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin datos de tipo disponibles.</p>
            )}
            {tipoEntries.map(({ tipo, count }) => {
              const percentage = totalCoupons > 0 ? (Number(count) / totalCoupons) * 100 : 0;
              return (
                <div key={tipo} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{tipo === '0' ? 'Cupón' : tipo}</span>
                    <span className="text-muted-foreground">{numberFormatter.format(count)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promedios vs. totales</CardTitle>
            <CardDescription>Comparativa rápida de interacción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Promedio vistas</p>
                <p className="text-lg font-semibold">{averageViews.toFixed(2)}</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Promedio escaneos</p>
                <p className="text-lg font-semibold">{averageScans.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground">Usos reportados</p>
                <p className="text-lg font-semibold">{numberFormatter.format(totals?.usado ?? 0)}</p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground">Comentarios</p>
                <p className="text-lg font-semibold">{numberFormatter.format(totals?.comentarios ?? 0)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Valores calculados en base a los datos agregados de la respuesta. Para granularidad adicional se requiere acceso a endpoints específicos de canjes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
