'use client';

import { motion } from 'framer-motion';
import { useAchievement } from '@/hooks/useAchievement';
import { achievements } from '@/config/achievements';

export default function AchievementList() {
  const { achievements: unlockedAchievements } = useAchievement();

  // 按解锁状态分组成就
  const unlockedList = achievements.filter(achievement => 
    unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
  );

  if (unlockedList.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">已解锁成就</h2>
        <p className="text-gray-600 dark:text-gray-400">还没有解锁任何成就，继续加油！</p>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">已解锁成就</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {unlockedList.map(achievement => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{achievement.icon}</span>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {achievement.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
