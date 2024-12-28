import { useState, useEffect } from 'react'
import { achievements as achievementsList } from '../config/achievements'

const STORAGE_KEY = 'user_achievements'

export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const [newAchievement, setNewAchievement] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedAchievements))
  }, [unlockedAchievements])

  const addAchievement = (achievementId, triggerTask) => {
    const achievement = achievementsList.find(a => a.id === achievementId)
    if (achievement && !unlockedAchievements.some(a => a.id === achievementId)) {
      const achievementRecord = {
        ...achievement,
        earnedAt: new Date().toISOString(),
        triggerTask: {
          id: triggerTask.id,
          title: triggerTask.title,
          description: triggerTask.description
        }
      }
      setUnlockedAchievements(prev => [...prev, achievementRecord])
      setNewAchievement(achievementRecord)
      return achievementRecord
    }
    return null
  }

  const removeAchievement = (achievementId) => {
    setUnlockedAchievements(prev => prev.filter(a => a.id !== achievementId))
  }

  const checkAchievements = (tasks) => {
    if (!tasks?.length) return

    // 检查每个未解锁的成就
    const unlockedAchievementsIds = unlockedAchievements.map(a => a.id)
    for (const achievement of achievementsList) {
      if (!unlockedAchievementsIds.includes(achievement.id)) {
        try {
          if (achievement.condition(tasks)) {
            // 找到触发这个成就的最后一个完成的任务
            const lastCompletedTask = [...tasks]
              .reverse()
              .find(t => t.progress === 100)
            
            if (lastCompletedTask) {
              addAchievement(achievement.id, lastCompletedTask)
            }
          }
        } catch (error) {
          console.error(`Error checking achievement ${achievement.id}:`, error)
        }
      }
    }

    // 检查已解锁的成就是否仍然满足条件
    unlockedAchievements.forEach(achievement => {
      const achievementConfig = achievementsList.find(a => a.id === achievement.id)
      if (achievementConfig && !achievementConfig.condition(tasks)) {
        removeAchievement(achievement.id)
      }
    })
  }

  return {
    achievements: unlockedAchievements,
    newAchievement,
    clearNewAchievement: () => setNewAchievement(null),
    checkAchievements
  }
}
