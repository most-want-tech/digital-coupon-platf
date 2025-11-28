'use client';

import App from '@/App';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/ErrorFallback';

export default function HomePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  );
}
