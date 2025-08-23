import React from 'react';
import { SecuritySettings } from '@/components/security/SecuritySettings';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function Security() {
  return (
    <MobileLayout
      title="Security & Privacy"
      subtitle="Manage your account security and privacy settings"
      showBottomNav={false}
    >
      <div className="p-4">
        <SecuritySettings />
      </div>
    </MobileLayout>
  );
}