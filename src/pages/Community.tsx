import React from 'react';
import { CommunityForum } from '@/components/community/CommunityForum';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function Community() {
  return (
    <MobileLayout
      title="Community"
      subtitle="Connect with others and share experiences"
      showBottomNav={false}
    >
      <div className="p-4">
        <CommunityForum />
      </div>
    </MobileLayout>
  );
}