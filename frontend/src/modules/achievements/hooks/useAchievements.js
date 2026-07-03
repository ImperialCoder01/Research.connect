import { useState, useEffect, useMemo, useCallback } from 'react';
import { MOCK_ACHIEVEMENTS } from '../constants/achievements.constants';

/**
 * useAchievements
 * ─────────────────────────────────────────────────────────────────────────────
 * Encapsulates ALL business logic for the Achievements page.
 * No business logic lives inside page or card components.
 */
const useAchievements = () => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel]       = useState('all');
  const [viewMode, setViewMode]             = useState('grid'); // 'grid' | 'timeline'
  const [isLoading, setIsLoading]           = useState(true);

  // Initialise pinned set from mock data's isPinned flag
  const [pinnedIds, setPinnedIds] = useState(
    () => new Set(MOCK_ACHIEVEMENTS.filter((a) => a.isPinned).map((a) => a.id))
  );

  // Simulate network latency
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const togglePin = useCallback((id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Derived: filtered + sorted (pinned first)
  const achievements = useMemo(() => {
    let result = [...MOCK_ACHIEVEMENTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (activeLevel !== 'all') {
      result = result.filter((a) => a.level === activeLevel);
    }

    // Pinned items always appear first
    return result.sort((a, b) => {
      const aPinned = pinnedIds.has(a.id) ? 0 : 1;
      const bPinned = pinnedIds.has(b.id) ? 0 : 1;
      return aPinned - bPinned;
    });
  }, [searchQuery, activeCategory, activeLevel, pinnedIds]);

  // Derived: overview statistics (always over the full dataset)
  const stats = useMemo(() => ({
    total:  MOCK_ACHIEVEMENTS.length,
    gold:   MOCK_ACHIEVEMENTS.filter((a) => a.level === 'Gold').length,
    silver: MOCK_ACHIEVEMENTS.filter((a) => a.level === 'Silver').length,
    bronze: MOCK_ACHIEVEMENTS.filter((a) => a.level === 'Bronze').length,
    points: MOCK_ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0),
  }), []);

  // Derived: the one achievement to highlight in the Featured banner
  const featuredAchievement = useMemo(
    () => MOCK_ACHIEVEMENTS.find((a) => a.isFeatured) ?? MOCK_ACHIEVEMENTS[0],
    []
  );

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveLevel('all');
  };

  return {
    achievements,
    totalCount: MOCK_ACHIEVEMENTS.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeLevel,
    setActiveLevel,
    viewMode,
    setViewMode,
    pinnedIds,
    togglePin,
    stats,
    featuredAchievement,
    resetFilters,
    hasActiveFilters:
      searchQuery.trim() !== '' ||
      activeCategory !== 'all' ||
      activeLevel !== 'all',
  };
};

export default useAchievements;
