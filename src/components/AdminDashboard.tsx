import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Analytics } from '@/components/dashboard/Analytics';
import { CouponManagement } from '@/components/dashboard/CouponManagement';
import { BusinessSettings } from '@/components/dashboard/BusinessSettings';
import type { BrandConfig, Business, RouticketApiResponse, RouticketCoupon } from '@/lib/types';
import { 
  ArrowLeft,
  ChartBar,
  Tag,
  Gear,
  Storefront,
  SquaresFour,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { Toaster } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminDashboardProps {
  onBackToCustomer: () => void;
  brandConfigs: Record<string, BrandConfig>;
  onBrandConfigUpdate: (
    configs:
      | Record<string, BrandConfig>
      | ((prev?: Record<string, BrandConfig>) => Record<string, BrandConfig>)
  ) => void;
  apiData: RouticketApiResponse | null;
  partnerId: number;
  apiPublicKey: string;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function AdminDashboard({
  onBackToCustomer,
  brandConfigs,
  onBrandConfigUpdate,
  apiData,
  partnerId,
  apiPublicKey,
  isLoading,
  error,
  onRefresh
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const partnerCoupons = useMemo<RouticketCoupon[]>(() => {
    if (!apiData) return [];
    return apiData.cupones.filter(
      (coupon) => Number(coupon.id_partner) === partnerId
    );
  }, [apiData, partnerId]);

  const currentBusiness: Business = useMemo(() => {
    const firstCoupon = partnerCoupons[0];
    return {
      id: `partner-${partnerId}`,
      name: `Partner ${partnerId}`,
      logo: firstCoupon?.foto_post || firstCoupon?.foto || 'https://routicket.com/favicon.ico',
      category: 'food',
      description: apiData?.api_usage?.note || 'Datos sincronizados desde la API de Routicket.',
      address: 'No disponible',
      hours: 'Sin horario disponible',
      phone: 'No disponible',
      coverImage: firstCoupon?.foto || firstCoupon?.foto_post || 'https://routicket.com/favicon.ico'
    };
  }, [partnerId, apiData?.api_usage?.note, partnerCoupons]);

  const currentBrandConfig = brandConfigs?.[currentBusiness.id];

  const handleBrandConfigUpdate = (config: BrandConfig) => {
    onBrandConfigUpdate((prev = {}) => ({
      ...prev,
      [currentBusiness.id]: config
    }));
  };

  const apiUsage = apiData?.api_usage;
  const stats = apiData?.stats;

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2" 
                onClick={onBackToCustomer}
              >
                <ArrowLeft className="w-4 h-4" />
                Customer View
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Storefront className="w-6 h-6 text-primary" weight="duotone" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{currentBusiness.name}</h1>
                  <p className="text-xs text-muted-foreground">Business Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {apiUsage && (
                <Badge variant="outline" className="gap-2">
                  <SquaresFour className="w-4 h-4" />
                  API {apiUsage.contador}/{apiUsage.contador_prev + apiUsage.contador}
                </Badge>
              )}
              <Badge variant="secondary" className="gap-2">
                <SquaresFour className="w-4 h-4" />
                Admin Mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <ArrowsClockwise className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Actualizando' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ocurrió un problema al consultar la API</AlertTitle>
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-3"
                onClick={onRefresh}
              >
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <SquaresFour className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <ChartBar className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Coupons</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Banner */}
            <div className="rounded-lg border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">
                    Welcome to Your Admin Dashboard
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Monitor your coupon performance in real-time. Track redemptions, analyze customer engagement, 
                    and grow your business with data-driven insights.
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">Datos en vivo</Badge>
              </div>
            </div>
            
            <DashboardOverview
              isLoading={isLoading}
              partnerName={currentBusiness.name}
              apiUsage={apiUsage}
              stats={stats}
              coupons={partnerCoupons}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics
              isLoading={isLoading}
              stats={stats}
              coupons={partnerCoupons}
            />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <CouponManagement
              isLoading={isLoading}
              coupons={partnerCoupons}
              apiPublicKey={apiPublicKey}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <BusinessSettings
              business={currentBusiness}
              brandConfig={currentBrandConfig}
              onBrandConfigUpdate={handleBrandConfigUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
