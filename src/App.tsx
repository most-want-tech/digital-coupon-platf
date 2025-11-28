'use client';

import { PersonalizationProvider } from '@/contexts/PersonalizationContext';
import { CustomerExperience } from '@/components/customer/CustomerExperience';

function App() {
  return (
    <PersonalizationProvider>
      <CustomerExperience />
    </PersonalizationProvider>
  );
}

export default App;
