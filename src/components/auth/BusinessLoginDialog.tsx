'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from '@phosphor-icons/react';

interface BusinessLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demoEmail: string;
  demoPassword: string;
  error?: string | null;
  onAuthenticate: (credentials: { email: string; password: string }) => void;
}

export function BusinessLoginDialog({
  open,
  onOpenChange,
  demoEmail,
  demoPassword,
  error,
  onAuthenticate
}: BusinessLoginDialogProps) {
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (open) {
      setEmail(demoEmail);
      setPassword('');
    }
  }, [open, demoEmail]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAuthenticate({ email, password });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Inicia sesión como negocio
          </DialogTitle>
          <DialogDescription>
            Usa las credenciales demo para activar el panel administrativo y las herramientas de
            personalización.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-email">Correo empresarial</Label>
            <Input
              id="business-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-password">Contraseña</Label>
            <Input
              id="business-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Credenciales demo</p>
            <p>Email: {demoEmail}</p>
            <p>Contraseña: {demoPassword}</p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error al iniciar sesión</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Desbloquear panel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
