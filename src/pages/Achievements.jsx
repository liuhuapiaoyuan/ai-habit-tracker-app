import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AchievementBadge from '../components/AchievementBadge'
import AchievementModal from '../components/AchievementModal'
import { useAchievements } from '../hooks/useAchievements'
import { achievements as achievementsList } from '../config/achievements'

const flipVariants = {
  initial: { rotateY: 0 },
  hover: { rotateY: 180 }
}

const AchievementsPage = () => {
  const { achievements: unlockedAchievements } = useAchievements()
  const [selectedAchievement, setSelectedAchievement] = useState(null)

  // 检查成就是否已解锁
  const isAchievementUnlocked = (achievementId) => {
    return unlockedAchievements.some(a => a.id === achievementId)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-8">成就系统</h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {achievementsList.map(achievement => (
          <motion.div
            key={achievement.id}
            whileHover="hover"
            initial="initial"
            variants={flipVariants}
            transition={{ duration: 0.5 }}
            style={{ perspective: '1000px' }}
          >
            <AchievementBadge
              achievement={achievement}
              unlocked={isAchievementUnlocked(achievement.id)}
              onClick={() => {
                // 如果成就已解锁，显示详细信息
                if (isAchievementUnlocked(achievement.id)) {
                  const unlockedAchievement = unlockedAchievements.find(a => a.id === achievement.id)
                  setSelectedAchievement(unlockedAchievement)
                } else {
                  setSelectedAchievement(achievement)
                }
              }}
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
