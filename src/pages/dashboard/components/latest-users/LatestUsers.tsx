// External components: https://ui.shadcn.com/docs/components
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
// Imports
import { Card, CardContent } from '@core/components/ui/card';
// React component
export function LatestUsers() {
  return (
    <main className='space-y-2'>
      <h2 className='text-xl font-medium text-dark-default'>{DASHBOARD_CONFIG.latestUsers.title}</h2>
      <Card>
        <CardContent className='grid gap-2 pt-6'>Latest users component</CardContent>
      </Card>
    </main>
  );
}
