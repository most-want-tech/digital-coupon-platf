import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Business, Coupon, RedemptionHistory } from '@/lib/types';
import { 
  TrendUp, 
  Tag, 
  Eye, 
  Users,
  Calendar
} from '@phosphor-icons/react';
import { format, subDays, isAfter, isBefore } from 'date-fns';

interface DashboardOverviewProps {
  business: Business;
  coupons: Coupon[];
  redemptions: RedemptionHistory[];
}

export function DashboardOverview({ business, coupons, redemptions }: DashboardOverviewProps) {
  const activeCoupons = coupons.filter(c => {
    const expiry = new Date(c.expiryDate);
    return isAfter(expiry, new Date());
  });

  const expiringSoon = coupons.filter(c => {
    const expiry = new Date(c.expiryDate);
    const soon = subDays(new Date(), -7);
    return isAfter(expiry, new Date()) && isBefore(expiry, soon);
  });

  const last30Days = redemptions.filter(r => {
    const redemptionDate = new Date(r.redeemedAt);
    const thirtyDaysAgo = subDays(new Date(), 30);
    return isAfter(redemptionDate, thirtyDaysAgo);
  });

  const topCoupons = coupons
    .map(coupon => ({
      ...coupon,
      redemptionCount: redemptions.filter(r => r.couponId === coupon.id).length
    }))
    .sort((a, b) => b.redemptionCount - a.redemptionCount)
    .slice(0, 3);

  const avgRedemptionPerCoupon = coupons.length > 0 
    ? (redemptions.length / coupons.length).toFixed(1) 
    : '0';

  const stats = [
    {
      title: 'Active Coupons',
      value: activeCoupons.length,
      change: `${coupons.length} total offers`,
      icon: Tag,
      color: 'text-blue-600'
    },
    {
      title: 'Total Redemptions',
      value: redemptions.length,
      change: `${last30Days.length} in last 30 days`,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Avg Per Coupon',
      value: avgRedemptionPerCoupon,
      change: 'redemptions per offer',
      icon: TrendUp,
      color: 'text-purple-600'
    },
    {
      title: 'Expiring Soon',
      value: expiringSoon.length,
      change: 'Within 7 days',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Coupons</CardTitle>
            <CardDescription>Coupons with the most redemptions</CardDescription>
          </CardHeader>
          <CardContent>
            {topCoupons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No redemptions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCoupons.map((coupon, index) => (
                  <div key={coupon.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <img 
                      src={coupon.image} 
                      alt={coupon.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{coupon.title}</p>
                      <p className="text-sm text-muted-foreground">{coupon.discount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{coupon.redemptionCount}</p>
                      <p className="text-xs text-muted-foreground">redemptions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest coupon redemptions</CardDescription>
          </CardHeader>
          <CardContent>
            {redemptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {redemptions.slice(-5).reverse().map((redemption, index) => {
                  const coupon = coupons.find(c => c.id === redemption.couponId);
                  if (!coupon) return null;
                  
                  return (
                    <div key={`${redemption.couponId}-${index}`} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <img 
                        src={coupon.image} 
                        alt={coupon.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{coupon.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(redemption.redeemedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
