import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const ExperienceTimeline = ({ experience }) => {
  if (!experience || experience.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-border rounded-2xl">
        <Briefcase className="w-8 h-8 text-text-secondary mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold text-text-secondary">No experience details added yet</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-border/80 space-y-8 py-2">
      {experience.map((exp, idx) => (
        <motion.div
          key={exp._id || idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="relative"
        >
          {/* Circular Indicator */}
          <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white bg-primary shadow-sm" />

          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  {exp.designation}
                </h4>
                <p className="text-xs text-text-secondary font-bold">
                  {exp.institution}
                </p>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                {exp.duration}
              </span>
            </div>

            {exp.researchFocus && (
              <p className="text-xs text-text-secondary pt-1">
                <span className="font-bold text-primary/80">Research Focus:</span> {exp.researchFocus}
              </p>
            )}

            {exp.description && (
              <p className="text-xs text-text-secondary leading-relaxed pt-2 border-t border-border/50">
                {exp.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExperienceTimeline;
