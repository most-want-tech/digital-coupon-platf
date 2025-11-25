import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { CouponManagement } from './dashboard/CouponManagement';
import { BusinessSettings } from './dashboard/BusinessSettings';
import { Analytics } from './dashboard/Analytics';
import { DemoWelcome } from './dashboard/DemoWelcome';
import { mockBusinesses, mockCoupons } from '@/lib/mock-data';
import { Business, Coupon, RedemptionHistory, BrandConfig } from '@/lib/types';
import { 
  ChartBar, 
  Tag, 
  Gear, 
  SignOut, 
  Storefront,
  House
} from '@phosphor-icons/react';
import { Toaster } from 'sonner';

interface BusinessDashboardProps {
  onBackToCustomer: () => void;
  brandConfigs: Record<string, BrandConfig>;
  onBrandConfigUpdate: (configs: Record<string, BrandConfig> | ((prev?: Record<string, BrandConfig>) => Record<string, BrandConfig>)) => void;
}

export function BusinessDashboard({ onBackToCustomer, brandConfigs, onBrandConfigUpdate }: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(mockBusinesses[0].id);
  const [redemptionHistory] = useKV<RedemptionHistory[]>('redemption-history', []);
  const [showWelcome, setShowWelcome] = useKV<boolean>('business-welcome-shown', true);

  const selectedBusiness = mockBusinesses.find(b => b.id === selectedBusinessId);
  const businessCoupons = mockCoupons.filter(c => c.businessId === selectedBusinessId);

  const redemptionHistoryArray = redemptionHistory || [];
  const businessRedemptions = redemptionHistoryArray.filter(r => 
    businessCoupons.some(c => c.id === r.couponId)
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster position="top-center" />
      
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Storefront className="w-6 h-6 text-primary-foreground" weight="fill" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Panel de Negocio</h1>
                <p className="text-xs text-muted-foreground">Gestiona tus cupones digitales</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={onBackToCustomer}
              >
                <House className="w-4 h-4" />
                Vista Cliente
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <SignOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedBusiness?.logo} 
                    alt={selectedBusiness?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="text-2xl">{selectedBusiness?.name}</CardTitle>
                    <CardDescription>{selectedBusiness?.category}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Activo
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <House className="w-4 h-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Tag className="w-4 h-4" />
              Cupones
              <Badge variant="secondary" className="ml-1">
                {businessCoupons.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <ChartBar className="w-4 h-4" />
              Analíticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {showWelcome && (
            <div className="mb-6">
              <DemoWelcome onDismiss={() => setShowWelcome(false)} />
            </div>
          )}

          <TabsContent value="overview">
            <DashboardOverview 
              business={selectedBusiness!}
              coupons={businessCoupons}
              redemptions={businessRedemptions}
            />
          </TabsContent>

          <TabsContent value="coupons">
            <CouponManagement 
              businessId={selectedBusinessId}
              coupons={businessCoupons}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics 
              businessId={selectedBusinessId}
              coupons={businessCoupons}
              redemptions={businessRedemptions}
            />
          </TabsContent>

          <TabsContent value="settings">
            <BusinessSettings 
              business={selectedBusiness!}
              brandConfig={brandConfigs[selectedBusinessId]}
              onBrandConfigUpdate={(config) => {
                onBrandConfigUpdate((prev) => ({
                  ...prev,
                  [selectedBusinessId]: config
                }));
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
