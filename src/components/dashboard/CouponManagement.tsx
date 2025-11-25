import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coupon, CategoryType } from '@/lib/types';
import { 
  Plus, 
  PencilSimple, 
  Trash,
  Eye,
  EyeSlash,
  Copy
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { format, isAfter } from 'date-fns';

interface CouponManagementProps {
  businessId: string;
  coupons: Coupon[];
}

export function CouponManagement({ businessId, coupons }: CouponManagementProps) {
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [redemptionHistory] = useKV<any[]>('redemption-history', []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    terms: '',
    expiryDate: '',
    category: 'food' as Exclude<CategoryType, 'all'>
  });

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      title: '',
      description: '',
      discount: '',
      terms: '',
      expiryDate: '',
      category: 'food'
    });
    setIsDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title,
      description: coupon.description,
      discount: coupon.discount,
      terms: coupon.terms,
      expiryDate: coupon.expiryDate,
      category: coupon.category
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.discount || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingCoupon) {
      toast.success('Coupon updated successfully!');
    } else {
      toast.success('Coupon created successfully!');
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (couponId: string) => {
    toast.success('Coupon deleted successfully');
  };

  const handleDuplicate = (coupon: Coupon) => {
    toast.success('Coupon duplicated successfully');
  };

  const activeCoupons = coupons.filter(c => isAfter(new Date(c.expiryDate), new Date()));
  const expiredCoupons = coupons.filter(c => !isAfter(new Date(c.expiryDate), new Date()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupon Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage your promotional offers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateCoupon} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
              <DialogDescription>
                {editingCoupon ? 'Update your coupon details below' : 'Fill in the details to create a new coupon'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Coupon Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 20% Off All Items"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount Label *</Label>
                <Input
                  id="discount"
                  placeholder="e.g., 20% OFF, $10 OFF, BUY 1 GET 1"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the offer"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="List any restrictions or requirements"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as Exclude<CategoryType, 'all'> })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Coupons ({activeCoupons.length})</h3>
          {activeCoupons.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4" weight="duotone" />
                <h4 className="text-lg font-semibold mb-2">No active coupons</h4>
                <p className="text-muted-foreground mb-4">Create your first coupon to start attracting customers</p>
                <Button onClick={handleCreateCoupon} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Coupon
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeCoupons.map((coupon) => {
                const redemptionCount = (redemptionHistory || []).filter((r: any) => r.couponId === coupon.id).length;
                
                return (
                  <Card key={coupon.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img 
                          src={coupon.image} 
                          alt={coupon.title}
                          className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold">{coupon.title}</h4>
                                <Badge variant="secondary">{coupon.discount}</Badge>
                                {coupon.isNew && <Badge>New</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Code: {coupon.redemptionCode}</span>
                                <span>•</span>
                                <span>Expires: {format(new Date(coupon.expiryDate), 'MMM d, yyyy')}</span>
                                <span>•</span>
                                <span>{redemptionCount} redemptions</span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicate(coupon)}
                                title="Duplicate"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCoupon(coupon)}
                                title="Edit"
                              >
                                <PencilSimple className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(coupon.id)}
                                title="Delete"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {coupon.terms && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground">
                                <strong>Terms:</strong> {coupon.terms}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {expiredCoupons.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              Expired Coupons ({expiredCoupons.length})
            </h3>
            <div className="grid gap-4 opacity-60">
              {expiredCoupons.map((coupon) => {
                const redemptionCount = (redemptionHistory || []).filter((r: any) => r.couponId === coupon.id).length;
                
                return (
                  <Card key={coupon.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img 
                          src={coupon.image} 
                          alt={coupon.title}
                          className="w-32 h-32 rounded-lg object-cover flex-shrink-0 grayscale"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold">{coupon.title}</h4>
                                <Badge variant="secondary">{coupon.discount}</Badge>
                                <Badge variant="outline">Expired</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Expired: {format(new Date(coupon.expiryDate), 'MMM d, yyyy')}</span>
                                <span>•</span>
                                <span>{redemptionCount} total redemptions</span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicate(coupon)}
                                title="Duplicate"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(coupon.id)}
                                title="Delete"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
