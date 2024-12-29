'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { achievements } from '@/config/achievements';
import AchievementModal from '@/components/AchievementModal';
import { useAppState } from '@/store/AppContext';
import { useAchievement } from '@/hooks/useAchievement';

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function AchievementsPage() {
  const {state:{tasks,completions}} = useAppState()
  const { unlockedAchievements } = useAchievement();
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null);

  // 获取成就记录的Map
  const achievementRecords = new Map(
    unlockedAchievements.map(record => [record.id, record])
  );

  return (
    <div className="">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">成就系统</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          点击成就查看详细信息
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map(achievement => {
            const isUnlocked = achievementRecords.has(achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setSelectedAchievement(achievement)}
                className={`
                  relative p-4 rounded-lg text-center cursor-pointer
                  ${isUnlocked 
                    ? 'bg-white dark:bg-gray-800 shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-700'
                  }
                `}
              >
                <div className="relative">
                  <span className={`text-4xl mb-2 inline-block ${!isUnlocked && 'opacity-50'}`}>
                    {isUnlocked ? achievement.icon : '🔒'}
                  </span>
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    />
                  )}
                </div>
                
                <h3 className={`text-sm font-semibold mb-1
                  ${isUnlocked 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {achievement.title}
                </h3>
                
                <p className={`text-xs
                  ${isUnlocked 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-gray-400 dark:text-gray-500'
                  }
                `}>
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          achievementRecord={achievementRecords.get(selectedAchievement.id)}
          isOpen={true}
          onClose={() => setSelectedAchievement(null)}
          tasks={tasks}
          completions={completions}
        />
      )}
    </div>
  );
}
