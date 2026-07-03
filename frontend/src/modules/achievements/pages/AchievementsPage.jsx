import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Search, X, SlidersHorizontal,
  LayoutGrid, AlignJustify, Share2, Pin, Calendar, Building2, Star,
} from 'lucide-react';
import useAchievements from '../hooks/useAchievements';
import AchievementCard from '../components/AchievementCard';
import AchievementCardSkeleton from '../components/AchievementCardSkeleton';
import AchievementsEmptyState from '../components/AchievementsEmptyState';
import AchievementShareModal from '../components/AchievementShareModal';
import Button from '../../../components/common/buttons/Button';
import { CATEGORY_FILTERS, LEVEL_FILTERS, LEVEL_STYLES } from '../constants/achievements.constants';

/**
 * AchievementsPage
 * ─────────────────────────────────────────────────────────────────────────────
 * Rendered at /achievements. Wrapped by ProtectedRoute > AppLayout.
 * Sections: Header · Stats · Featured · Search/Filters · Grid/Timeline · Modal
 */
const SKELETON_COUNT = 6;

// Stat card configuration — derived at render time from hook stats
const buildStatCards = (s) => [
  { label: 'Total Earned', value: s.total,  emoji: '🏆', bg: 'bg-gradient-primary',                               textVal: 'text-white',      textLabel: 'text-blue-100'   },
  { label: 'Gold',         value: s.gold,   emoji: '🥇', bg: 'bg-amber-50  border border-amber-100',              textVal: 'text-amber-700',  textLabel: 'text-amber-500'  },
  { label: 'Silver',       value: s.silver, emoji: '🥈', bg: 'bg-slate-100 border border-slate-200',              textVal: 'text-slate-600',  textLabel: 'text-slate-400'  },
  { label: 'Bronze',       value: s.bronze, emoji: '🥉', bg: 'bg-orange-50 border border-orange-100',             textVal: 'text-orange-700', textLabel: 'text-orange-400' },
];

const AchievementsPage = () => {
  const {
    achievements, totalCount, isLoading,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    activeLevel, setActiveLevel,
    viewMode, setViewMode,
    pinnedIds, togglePin,
    stats, featuredAchievement,
    resetFilters, hasActiveFilters,
  } = useAchievements();

  const [shareTarget, setShareTarget] = useState(null);
  const statCards = buildStatCards(stats);

  return (
    <div className="space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm shrink-0">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight leading-none">
            My Achievements
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {isLoading ? 'Loading your achievements…' : `${totalCount} total · ${stats.points.toLocaleString()} total points`}
          </p>
        </div>
      </div>

      {/* ── Overview Statistics ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`rounded-2xl p-4 shadow-sm transition-shadow ${card.bg}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl leading-none">{card.emoji}</span>
              {isLoading
                ? <div className="w-9 h-7 bg-black/10 rounded-lg animate-pulse" />
                : <span className={`text-2xl font-black ${card.textVal} tabular-nums`}>{card.value}</span>
              }
            </div>
            <p className={`text-xs font-semibold ${card.textLabel}`}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Featured Achievement ─────────────────────────────────────────────── */}
      {!isLoading && featuredAchievement && (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-md h-56 sm:h-64 group">
          <img
            src={featuredAchievement.image}
            alt={featuredAchievement.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/92 via-slate-900/60 to-slate-900/10" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                ⭐ Featured Achievement
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow ${LEVEL_STYLES[featuredAchievement.level].badge}`}>
                {LEVEL_STYLES[featuredAchievement.level].icon} {featuredAchievement.level}
              </span>
            </div>

            {/* Bottom content */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-1.5 line-clamp-2 drop-shadow">
                {featuredAchievement.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/65 text-xs mb-4">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {featuredAchievement.organization}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featuredAchievement.dateEarned).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  {featuredAchievement.points} pts
                </span>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  onClick={() => setShareTarget(featuredAchievement)}
                >
                  Share
                </Button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => togglePin(featuredAchievement.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    pinnedIds.has(featuredAchievement.id)
                      ? 'bg-white text-primary border-white shadow-sm'
                      : 'bg-white/10 text-white border-white/25 hover:bg-white/20'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" style={pinnedIds.has(featuredAchievement.id) ? { fill: 'currentColor' } : {}} />
                  {pinnedIds.has(featuredAchievement.id) ? 'Pinned' : 'Pin'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Search + Filters ──────────────────────────────────────────────────── */}
      <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
        {/* Search + view toggle row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            <input
              id="achievements-search"
              type="text"
              placeholder="Search by title, organization, category or skill…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-bg-page border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Grid / Timeline toggle */}
          <div className="flex items-center p-1 bg-bg-page border border-border rounded-xl gap-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid view"
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              title="Timeline view"
              aria-label="Timeline view"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveCategory(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === f.value
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-bg-page text-text-secondary border-border hover:border-primary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Level filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-text-secondary shrink-0 w-[55px]">Level:</span>
          {LEVEL_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveLevel(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeLevel === f.value
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-bg-page text-text-secondary border-border hover:border-primary hover:text-primary'
              }`}
            >
              {f.value !== 'all' && `${LEVEL_STYLES[f.value].icon} `}{f.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-accent-red hover:underline font-semibold transition"
            >
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────────────── */}
      {!isLoading && (
        <motion.p
          key={achievements.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-text-secondary"
        >
          {hasActiveFilters
            ? `Showing ${achievements.length} of ${totalCount} achievements`
            : `All ${totalCount} achievements`}
        </motion.p>
      )}

      {/* ── Achievement Grid / Timeline ──────────────────────────────────────── */}
      {/*
        Always use CSS grid so AchievementsEmptyState's col-span-full works.
        Grid mode: 3-column responsive grid.
        Timeline mode: single-column grid (visually identical to a stacked list).
      */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'grid grid-cols-1 gap-4'
      }>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <AchievementCardSkeleton key={i} />
            ))
          : achievements.length > 0
            ? achievements.map((ach) => (
                <AchievementCard
                  key={ach.id}
                  achievement={ach}
                  onShare={setShareTarget}
                  isPinned={pinnedIds.has(ach.id)}
                  onTogglePin={togglePin}
                />
              ))
            : (
                <AchievementsEmptyState
                  hasActiveFilters={hasActiveFilters}
                  onReset={resetFilters}
                />
              )
        }
      </div>

      {/* ── Share Modal ──────────────────────────────────────────────────────── */}
      <AchievementShareModal
        isOpen={!!shareTarget}
        onClose={() => setShareTarget(null)}
        achievement={shareTarget}
      />
    </div>
  );
};

export default AchievementsPage;
