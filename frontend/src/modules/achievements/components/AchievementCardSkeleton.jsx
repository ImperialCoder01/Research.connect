import React from 'react';
import Skeleton from '../../../components/common/loaders/Skeleton';

/**
 * AchievementCardSkeleton
 * ─────────────────────────────────────────────────────────────────────────────
 * Loading placeholder that mirrors the real AchievementCard layout.
 * Reuses the existing Skeleton component from components/common/loaders.
 */
const AchievementCardSkeleton = () => (
  <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
    {/* Cover image */}
    <Skeleton variant="rectangular" height={160} className="w-full rounded-none" />

    <div className="p-5 space-y-3">
      {/* Level badge + category row */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="28%" height={22} className="rounded-full" />
        <Skeleton variant="text" width="30%" height={20} className="rounded-full" />
      </div>

      {/* Title */}
      <Skeleton variant="text" width="90%" height={22} />
      <Skeleton variant="text" width="60%" height={16} />

      {/* Organization + date */}
      <div className="flex gap-3 pt-1">
        <Skeleton variant="text" width="40%" height={14} />
        <Skeleton variant="text" width="35%" height={14} />
      </div>

      {/* Skills */}
      <div className="flex gap-2 pt-1">
        <Skeleton variant="text" width={64}  height={24} className="rounded-full" />
        <Skeleton variant="text" width={72}  height={24} className="rounded-full" />
        <Skeleton variant="text" width={56}  height={24} className="rounded-full" />
      </div>

      {/* Action row */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Skeleton variant="rectangular" height={34} className="flex-1 rounded-lg" />
        <Skeleton variant="rectangular" height={34} className="flex-1 rounded-lg" />
        <Skeleton variant="rectangular" width={34} height={34} className="rounded-lg" />
      </div>
    </div>
  </div>
);

export default AchievementCardSkeleton;
