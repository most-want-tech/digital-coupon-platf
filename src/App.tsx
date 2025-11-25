import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CouponCard } from '@/components/CouponCard';
import { RedemptionModal } from '@/components/RedemptionModal';
import { BusinessModal } from '@/components/BusinessModal';
import { BusinessDashboard } from '@/components/BusinessDashboard';
import { mockBusinesses, mockCoupons } from '@/lib/mock-data';
import { CategoryType, Coupon, RedemptionHistory } from '@/lib/types';
import { Tag, Heart, Storefront } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';

function App() {
  const [viewMode, setViewMode] = useState<'customer' | 'business'>('customer');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [savedCoupons, setSavedCoupons] = useKV<string[]>('saved-coupons', []);
  const [redemptionHistory, setRedemptionHistory] = useKV<RedemptionHistory[]>('redemption-history', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [redemptionModalOpen, setRedemptionModalOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  if (viewMode === 'business') {
    return <BusinessDashboard onBackToCustomer={() => setViewMode('customer')} />;
  }

  const savedCouponsArray = savedCoupons || [];
  const redemptionHistoryArray = redemptionHistory || [];

  const filteredCoupons = mockCoupons.filter(coupon => {
    if (activeTab === 'saved' && !savedCouponsArray.includes(coupon.id)) {
      return false;
    }
    if (activeCategory === 'all') return true;
    return coupon.category === activeCategory;
  });

  const toggleSaveCoupon = (couponId: string) => {
    setSavedCoupons((current) => {
      const currentArray = current || [];
      if (currentArray.includes(couponId)) {
        toast.success('Removed from saved coupons');
        return currentArray.filter(id => id !== couponId);
      } else {
        toast.success('Saved for later!');
        return [...currentArray, couponId];
      }
    });
  };

  const handleRedeemClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setRedemptionModalOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (selectedCoupon) {
      setRedemptionHistory((current) => {
        const currentArray = current || [];
        return [
          ...currentArray,
          { couponId: selectedCoupon.id, redeemedAt: new Date().toISOString() }
        ];
      });
      toast.success('Coupon redeemed successfully!');
    }
  };

  const isCouponRedeemed = (couponId: string) => {
    return redemptionHistoryArray.some(h => h.couponId === couponId);
  };

  const handleBusinessClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setBusinessModalOpen(true);
  };

  const selectedBusiness = selectedBusinessId 
    ? mockBusinesses.find(b => b.id === selectedBusinessId) || null
    : null;

  const businessCoupons = selectedBusinessId
    ? mockCoupons.filter(c => c.businessId === selectedBusinessId)
    : [];

  const selectedCouponBusiness = selectedCoupon
    ? mockBusinesses.find(b => b.id === selectedCoupon.businessId) || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary-foreground" weight="fill" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">CouponHub</h1>
                <p className="text-xs text-muted-foreground">Digital Savings Platform</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setViewMode('business')}
            >
              <Storefront className="w-4 h-4" />
              Business Login
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Discover Local Deals</h2>
          <p className="text-muted-foreground">
            Browse exclusive offers from your favorite local businesses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Tag className="w-4 h-4" />
              All Coupons
              <span className="ml-1 px-2 py-0.5 bg-muted rounded-full text-xs font-medium">
                {mockCoupons.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="w-4 h-4" />
              Saved
              <span className="ml-1 px-2 py-0.5 bg-muted rounded-full text-xs font-medium">
                {savedCouponsArray.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 mb-6">
            <CategoryFilter 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory}
            />
          </div>

          <TabsContent value="all" className="mt-0">
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No coupons found</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => {
                  const business = mockBusinesses.find(b => b.id === coupon.businessId);
                  if (!business) return null;
                  
                  return (
                    <div
                      key={coupon.id}
                      onClick={() => handleBusinessClick(business.id)}
                    >
                      <CouponCard
                        coupon={coupon}
                        business={business}
                        isSaved={savedCouponsArray.includes(coupon.id)}
                        isRedeemed={isCouponRedeemed(coupon.id)}
                        onToggleSave={() => toggleSaveCoupon(coupon.id)}
                        onRedeem={() => handleRedeemClick(coupon)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {savedCouponsArray.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved coupons</h3>
                <p className="text-muted-foreground mb-4">
                  Save your favorite deals to access them quickly later
                </p>
                <Button onClick={() => setActiveTab('all')}>
                  Browse Coupons
                </Button>
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No coupons found</h3>
                <p className="text-muted-foreground">
                  No saved coupons match the selected category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => {
                  const business = mockBusinesses.find(b => b.id === coupon.businessId);
                  if (!business) return null;
                  
                  return (
                    <div
                      key={coupon.id}
                      onClick={() => handleBusinessClick(business.id)}
                    >
                      <CouponCard
                        coupon={coupon}
                        business={business}
                        isSaved={true}
                        isRedeemed={isCouponRedeemed(coupon.id)}
                        onToggleSave={() => toggleSaveCoupon(coupon.id)}
                        onRedeem={() => handleRedeemClick(coupon)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">CouponHub Demo Platform</strong> - White-label digital coupon solution
            </p>
            <p>
              Ready to bring modern digital coupons to your local business community? This platform can be fully customized with your branding.
            </p>
          </div>
        </div>
      </footer>

      <RedemptionModal
        coupon={selectedCoupon}
        business={selectedCouponBusiness}
        open={redemptionModalOpen}
        onClose={() => {
          setRedemptionModalOpen(false);
          setSelectedCoupon(null);
        }}
        onConfirmRedeem={handleConfirmRedeem}
      />

      <BusinessModal
        business={selectedBusiness}
        coupons={businessCoupons}
        open={businessModalOpen}
        onClose={() => {
          setBusinessModalOpen(false);
          setSelectedBusinessId(null);
        }}
        onCouponClick={handleRedeemClick}
      />
    </div>
  );
}

export default App;