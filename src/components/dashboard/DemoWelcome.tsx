import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket,
  CheckCircle,
  Sparkle,
  X
} from '@phosphor-icons/react';

interface DemoWelcomeProps {
  onDismiss: () => void;
}

export function DemoWelcome({ onDismiss }: DemoWelcomeProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Welcome to CouponHub Business Dashboard
                <Badge variant="secondary" className="gap-1">
                  <Sparkle className="w-3 h-3" weight="fill" />
                  Demo
                </Badge>
              </CardTitle>
              <CardDescription>
                This is a fully functional demo showcasing all business management features
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium text-sm">Real-Time Analytics</p>
              <p className="text-xs text-muted-foreground">
                All analytics are live - redeem coupons in customer view to see updates
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium text-sm">Full CRUD Operations</p>
              <p className="text-xs text-muted-foreground">
                Create, edit, duplicate, and delete coupons with ease
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium text-sm">White-Label Branding</p>
              <p className="text-xs text-muted-foreground">
                Customize colors, logos, and branding to match your business
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <p className="font-medium text-sm">API Integration Ready</p>
              <p className="text-xs text-muted-foreground">
                Built with API endpoints in mind for seamless backend integration
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Switch back to customer view to see how your coupons appear to end users, then return here to track redemptions in real-time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
