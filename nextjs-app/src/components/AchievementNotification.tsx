'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAchievement } from '@/hooks/useAchievement';
import { Achievement } from '@/types/state';

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm"
      >
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{achievement.icon}</span>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            解锁新成就！
          </h3>
        </div>
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 dark:text-white">{achievement.title}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{achievement.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          关闭
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
