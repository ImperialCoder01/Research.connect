import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';
import Button from '../../../components/common/buttons/Button';

/**
 * AchievementsEmptyState
 * ─────────────────────────────────────────────────────────────────────────────
 * Shown when search / filter yields zero results.
 * Reuses Button component and follows the established ComingSoon visual style.
 */
const AchievementsEmptyState = ({ hasActiveFilters = false, onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="col-span-full flex flex-col items-center justify-center py-24 px-4 text-center"
  >
    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
      <Trophy className="w-10 h-10" />
    </div>

    <h3 className="text-xl font-bold text-text-primary mb-2">
      {hasActiveFilters ? 'No achievements found' : 'No achievements yet'}
    </h3>

    <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">
      {hasActiveFilters
        ? 'Try adjusting your search term or clearing the active filters to see more results.'
        : 'Your earned achievements, awards and recognitions will appear here.'}
    </p>

    {hasActiveFilters && onReset && (
      <Button
        variant="outline"
        onClick={onReset}
        icon={<RotateCcw className="w-4 h-4" />}
      >
        Clear Filters
      </Button>
    )}
  </motion.div>
);

export default AchievementsEmptyState;
