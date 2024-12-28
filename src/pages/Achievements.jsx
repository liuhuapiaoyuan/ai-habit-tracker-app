import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AchievementBadge from '../components/AchievementBadge'
import AchievementModal from '../components/AchievementModal'
import { useAchievements } from '../hooks/useAchievements'
import { achievements as achievementsList } from '../config/achievements'

const cardVariants = {
  initial: { scale: 1, rotateY: 0 },
  hover: { scale: 1.05, rotateY: 180 },
  tap: { scale: 0.95, rotateY: 180 }
}

const AchievementsPage = () => {
  const { achievements: unlockedAchievements } = useAchievements()
  const [selectedAchievement, setSelectedAchievement] = useState(null)

  // 检查成就是否已解锁
  const isAchievementUnlocked = (achievementId) => {
    return unlockedAchievements.some(a => a.id === achievementId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">成就系统</h2>
      <p className="text-gray-500 text-sm mb-6 text-center">长按或点击成就查看详情</p>
      
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {achievementsList.map(achievement => (
          <motion.div
            key={achievement.id}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
            variants={cardVariants}
            transition={{ duration: 0.3 }}
            style={{ perspective: '1000px' }}
            className="touch-manipulation"
            onClick={() => {
              // 如果成就已解锁，显示详细信息
              if (isAchievementUnlocked(achievement.id)) {
                const unlockedAchievement = unlockedAchievements.find(a => a.id === achievement.id)
                setSelectedAchievement(unlockedAchievement)
              } else {
                setSelectedAchievement(achievement)
              }
            }}
          >
            <AchievementBadge
              achievement={achievement}
              unlocked={isAchievementUnlocked(achievement.id)}
            />
          </motion.div>
        ))}
      </div>

      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  )
}

export default AchievementsPage
