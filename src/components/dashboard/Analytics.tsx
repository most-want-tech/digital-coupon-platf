import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coupon, RedemptionHistory } from '@/lib/types';
import { 
  ChartBar,
  TrendUp,
  Calendar,
  Tag
} from '@phosphor-icons/react';
import { format, subDays, isAfter, startOfDay } from 'date-fns';

interface AnalyticsProps {
  businessId: string;
  coupons: Coupon[];
  redemptions: RedemptionHistory[];
}

export function Analytics({ businessId, coupons, redemptions }: AnalyticsProps) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return startOfDay(date);
  });

  const redemptionsByDay = last30Days.map(day => {
    const count = redemptions.filter(r => {
      const redemptionDate = startOfDay(new Date(r.redeemedAt));
      return redemptionDate.getTime() === day.getTime();
    }).length;
    
    return {
      date: format(day, 'MMM d'),
      count
    };
  });

  const maxRedemptions = Math.max(...redemptionsByDay.map(d => d.count), 1);

  const categoryStats = coupons.reduce((acc, coupon) => {
    const redemptionCount = redemptions.filter(r => r.couponId === coupon.id).length;
    acc[coupon.category] = (acc[coupon.category] || 0) + redemptionCount;
    return acc;
  }, {} as Record<string, number>);

  const totalRedemptions = redemptions.length;
  const avgRedemptionsPerCoupon = coupons.length > 0 ? (totalRedemptions / coupons.length).toFixed(1) : '0';
  
  const last7DaysRedemptions = redemptions.filter(r => {
    const redemptionDate = new Date(r.redeemedAt);
    const sevenDaysAgo = subDays(new Date(), 7);
    return isAfter(redemptionDate, sevenDaysAgo);
  }).length;

  const previous7DaysRedemptions = redemptions.filter(r => {
    const redemptionDate = new Date(r.redeemedAt);
    const fourteenDaysAgo = subDays(new Date(), 14);
    const sevenDaysAgo = subDays(new Date(), 7);
    return isAfter(redemptionDate, fourteenDaysAgo) && !isAfter(redemptionDate, sevenDaysAgo);
  }).length;

  const growthRate = previous7DaysRedemptions > 0 
    ? (((last7DaysRedemptions - previous7DaysRedemptions) / previous7DaysRedemptions) * 100).toFixed(1)
    : last7DaysRedemptions > 0 ? '100' : '0';

  const topPerformers = coupons
    .map(coupon => ({
      ...coupon,
      redemptionCount: redemptions.filter(r => r.couponId === coupon.id).length
    }))
    .sort((a, b) => b.redemptionCount - a.redemptionCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Performance Analytics</h2>
        <p className="text-muted-foreground">
          Deep dive into your coupon performance metrics and customer engagement trends
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Tag className="w-5 h-5 text-primary" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRedemptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time across all coupons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
            <TrendUp className="w-5 h-5 text-green-600" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Number(growthRate) >= 0 ? '+' : ''}{growthRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {last7DaysRedemptions} redemptions this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Per Coupon</CardTitle>
            <ChartBar className="w-5 h-5 text-purple-600" weight="duotone" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgRedemptionsPerCoupon}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average redemptions per offer
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Redemptions Over Time</CardTitle>
          <CardDescription>Last 30 days of coupon activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end justify-between h-48 gap-1">
              {redemptionsByDay.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer"
                      style={{ 
                        height: `${(day.count / maxRedemptions) * 160}px`,
                        minHeight: day.count > 0 ? '4px' : '0px'
                      }}
                      title={`${day.date}: ${day.count} redemptions`}
                    />
                  </div>
                  {index % 5 === 0 && (
                    <span className="text-xs text-muted-foreground mt-2 rotate-0">
                      {day.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span className="text-sm text-muted-foreground">Redemptions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Redemptions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, count]) => {
                const percentage = totalRedemptions > 0 ? (count / totalRedemptions) * 100 : 0;
                const categoryLabels: Record<string, string> = {
                  food: 'Food & Dining',
                  retail: 'Retail',
                  services: 'Services',
                  entertainment: 'Entertainment'
                };
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{categoryLabels[category] || category}</span>
                      <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(categoryStats).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ChartBar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Most redeemed coupons</CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 || topPerformers.every(c => c.redemptionCount === 0) ? (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No redemptions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topPerformers.filter(c => c.redemptionCount > 0).map((coupon, index) => (
                  <div key={coupon.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <img 
                      src={coupon.image} 
                      alt={coupon.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{coupon.title}</p>
                      <p className="text-xs text-muted-foreground">{coupon.discount}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm">{coupon.redemptionCount}</p>
                      <p className="text-xs text-muted-foreground">uses</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
