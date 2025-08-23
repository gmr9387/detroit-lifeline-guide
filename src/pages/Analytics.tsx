import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function Analytics() {
  return (
    <MobileLayout
      title="Analytics"
      subtitle="Track user engagement and program impact"
      showBottomNav={false}
    >
      <div className="p-4">
        <AnalyticsDashboard />
      </div>
    </MobileLayout>
  );
}