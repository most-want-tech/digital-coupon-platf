import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Business, CategoryType } from '@/lib/types';
import { 
  FloppyDisk,
  Image as ImageIcon,
  Palette,
  Globe
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface BusinessSettingsProps {
  business: Business;
}

export function BusinessSettings({ business }: BusinessSettingsProps) {
  const [formData, setFormData] = useState({
    name: business.name,
    category: business.category,
    description: business.description,
    address: business.address,
    phone: business.phone,
    hours: business.hours,
    email: business.email || '',
    website: business.website || ''
  });

  const [brandingData, setBrandingData] = useState({
    primaryColor: '#4F46E5',
    secondaryColor: '#EC4899',
    accentColor: '#F59E0B',
    logoUrl: business.logo,
    coverUrl: business.coverImage
  });

  const handleSaveProfile = () => {
    toast.success('Business profile updated successfully!');
  };

  const handleSaveBranding = () => {
    toast.success('Branding settings updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold mb-1">Business Settings</h2>
        <p className="text-muted-foreground">Manage your business profile and branding</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Update your business information visible to customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name *</Label>
              <Input
                id="business-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Tell customers about your business"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, City, State"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@business.com"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hours">Business Hours</Label>
              <Input
                id="hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="Mon-Fri: 9am-6pm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.yourbusiness.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveProfile} className="gap-2">
              <FloppyDisk className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            White-Label Branding
          </CardTitle>
          <CardDescription>
            Customize the platform appearance with your brand colors and images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={brandingData.primaryColor}
                  onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={brandingData.primaryColor}
                  onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                  placeholder="#4F46E5"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Main brand color for buttons and highlights</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={brandingData.secondaryColor}
                  onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={brandingData.secondaryColor}
                  onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                  placeholder="#EC4899"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Supporting color for UI elements</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={brandingData.accentColor}
                  onChange={(e) => setBrandingData({ ...brandingData, accentColor: e.target.value })}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={brandingData.accentColor}
                  onChange={(e) => setBrandingData({ ...brandingData, accentColor: e.target.value })}
                  placeholder="#F59E0B"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Highlight color for deals and CTAs</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Logo URL
              </Label>
              <Input
                id="logo-url"
                value={brandingData.logoUrl}
                onChange={(e) => setBrandingData({ ...brandingData, logoUrl: e.target.value })}
                placeholder="https://your-logo-url.com/logo.png"
              />
              <div className="flex items-center gap-4 pt-2">
                <img 
                  src={brandingData.logoUrl} 
                  alt="Logo preview"
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <p className="text-xs text-muted-foreground">Logo preview (200x200px recommended)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-url" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Cover Image URL
              </Label>
              <Input
                id="cover-url"
                value={brandingData.coverUrl}
                onChange={(e) => setBrandingData({ ...brandingData, coverUrl: e.target.value })}
                placeholder="https://your-cover-url.com/cover.jpg"
              />
              <div className="pt-2">
                <img 
                  src={brandingData.coverUrl} 
                  alt="Cover preview"
                  className="w-full h-32 rounded-lg object-cover border"
                />
                <p className="text-xs text-muted-foreground mt-2">Cover image preview (1200x400px recommended)</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">White-Label Ready</h4>
                <p className="text-sm text-muted-foreground">
                  These customizations will be applied across the entire customer-facing platform. 
                  Your branding will replace the default CouponHub theme, creating a fully branded 
                  experience for your customers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveBranding} className="gap-2">
              <FloppyDisk className="w-4 h-4" />
              Save Branding
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Integration</CardTitle>
          <CardDescription>Connect your systems to CouponHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 border rounded-lg p-4">
            <p className="text-sm mb-4">
              Use the CouponHub API to integrate with your existing systems. Manage coupons, 
              track redemptions, and sync customer data programmatically.
            </p>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">API Endpoint</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value="https://api.couponhub.io/v1"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">Copy</Button>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value="sk_live_••••••••••••••••••••"
                    readOnly
                    type="password"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">Reveal</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline">View API Documentation</Button>
            <Button variant="outline">Generate New Key</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
