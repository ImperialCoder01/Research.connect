import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Filter, XCircle, Clock, Award, Eye,
  FileText, Users2, Globe, User, Building2, Briefcase
} from 'lucide-react';
import { staggerContainer, staggerItem } from './animations';
import { SectionLabel, COLORS } from './ui';

const CATEGORY_TABS = [
  { id: 'All', icon: Globe },
  { id: 'Researchers', icon: User },
  { id: 'Publications', icon: FileText },
  { id: 'Projects', icon: Briefcase },
];
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest Works', icon: Clock },
  { value: 'mostCited', label: 'Most Cited', icon: Award },
  { value: 'trending', label: 'Trending (Views)', icon: Eye },
];

const RadioPill = ({ active, icon: Icon, label, onClick, delay }) => {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      variants={staggerItem(reduce)}
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[13px] font-medium transition-all duration-200 ${
        active 
          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
          : 'bg-transparent border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
      <span>{label}</span>
    </motion.button>
  );
};

const FilterSidebar = ({ activeTab, setActiveTab, year, sort, onFilterChange, onReset }) => {
  const reduce = useReducedMotion();
  const [citationRange, setCitationRange] = useState([0, 500]);

  const toggleFromList = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const resetAll = () => {
    setCitationRange([0, 500]);
    onReset();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 self-start"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5" style={{ color: COLORS.primary }} />
          <h3 className="text-[11px] font-bold text-[#0F172A] uppercase tracking-widest">Filters</h3>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#EF4444] transition-colors duration-150"
        >
          <XCircle className="w-3 h-3" /> Reset
        </button>
      </div>
      <div className="border-t border-[#F1F5F9] mt-2 mb-3" />

      <div className="space-y-1.5 mb-3">
        <SectionLabel>Category</SectionLabel>
        <div className="space-y-1">
          {CATEGORY_TABS.map((tab) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              {tab.id}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="border-t border-[#F1F5F9] mb-3" />

      <div className="space-y-1.5 mb-3">
        <SectionLabel>Publication Year</SectionLabel>
        <input
          type="number"
          value={year}
          onChange={(e) => onFilterChange('year', e.target.value)}
          placeholder="e.g. 2024"
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5 mb-3">
        <SectionLabel>Sort By</SectionLabel>
        <motion.div variants={staggerContainer(reduce, 0.06)} initial="hidden" animate="show" className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <RadioPill
              key={opt.value}
              active={sort === opt.value}
              icon={opt.icon}
              label={opt.label}
              onClick={() => onFilterChange('sort', opt.value)}
            />
          ))}
        </motion.div>
      </div>

      <div className="space-y-1.5">
        <SectionLabel>Minimum Citations</SectionLabel>
        <input
          type="number"
          min={0}
          value={citationRange[1] === 0 ? '' : citationRange[1]}
          onChange={(e) => setCitationRange([0, e.target.value ? Number(e.target.value) : 0])}
          placeholder="e.g. 50"
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
        />
      </div>
    </motion.div>
  );
};

export default FilterSidebar;
