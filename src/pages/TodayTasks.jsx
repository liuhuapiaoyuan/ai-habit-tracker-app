import React, { useState, useEffect } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useAchievements } from '../hooks/useAchievements'
import AchievementNotification from '../components/AchievementNotification'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function TodayTasks() {
  const { tasks, completeTask, uncompleteTask } = useTasks()
  const { checkAchievements, newAchievement, clearNewAchievement } = useAchievements()
  const [newAchievementState, setNewAchievementState] = useState(null)

  const today = new Date().getDay()

  const todayTasks = tasks.filter(task => 
    (task.type === 'daily' || 
    (task.type === 'weekly' && task.days.includes(today)))
  )

  // 监听任务变化，检查成就
  useEffect(() => {
    checkAchievements(tasks)
  }, [tasks, checkAchievements])

  const handleCompleteTask = (taskId) => {
    const task = todayTasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTasks = completeTask(taskId)
  }

  const handleUncompleteTask = (taskId) => {
    const task = todayTasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTasks = uncompleteTask(taskId)
  }

  const getMotivationalMessage = (uncompletedCount) => {
    if (uncompletedCount === 0) return '太棒了！今天的任务都完成了！🎉'
    if (uncompletedCount === 1) return '就差最后一个任务了，加油！💪'
    return `还有 ${uncompletedCount} 个任务等待完成，继续努力！🌟`
  }

  const uncompletedCount = todayTasks.filter(task => task.progress !== 100).length

  if (todayTasks.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">今日待办</h2>
        <div className="bg-white p-6 rounded-lg shadow-cartoon">
          <p className="text-gray-500">今天还没有任务哦～</p>
          <div className="mt-4">
            <Link
              to="/manage"
              className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              去添加任务
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative">
        <h2 className="text-2xl font-bold mb-4">今日待办</h2>
        {/* 添加动态图标 */}
        <motion.div 
          className={`absolute right-0 top-0 ${uncompletedCount === 0 ? 'glow-effect' : ''}`}
          animate={{ 
            rotate: 360,
            scale: 1 + (todayTasks.filter(task => task.progress === 100).length / todayTasks.length)
          }}
          transition={{ 
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 0.5,
              ease: "easeOut"
            }
          }}
        >
          <span className="text-4xl">
            {new Date().getHours() >= 6 && new Date().getHours() < 18 ? '☀️' : '🌙'}
          </span>
        </motion.div>
      </div>
      
      <style jsx>{`
        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from {
            filter: drop-shadow(0 0 2px rgba(255, 255, 0, 0.8))
                    drop-shadow(0 0 4px rgba(255, 255, 0, 0.6))
                    drop-shadow(0 0 6px rgba(255, 255, 0, 0.4));
          }
          to {
            filter: drop-shadow(0 0 4px rgba(255, 255, 0, 0.9))
                    drop-shadow(0 0 8px rgba(255, 255, 0, 0.7))
                    drop-shadow(0 0 12px rgba(255, 255, 0, 0.5));
          }
        }
      `}</style>

      <div className="bg-white p-6 rounded-lg shadow-cartoon mb-6">
        <p className="text-center text-gray-600">{getMotivationalMessage(uncompletedCount)}</p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {todayTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-lg shadow-cartoon"
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    ${task.progress === 100 ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  {task.icon || '📝'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`
                      text-sm px-2 py-0.5 rounded-full
                      ${task.reward >= 4 ? 'bg-purple-100 text-purple-700' :
                        task.reward >= 3 ? 'bg-blue-100 text-blue-700' :
                        task.reward >= 2 ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'}
                    `}>
                      {task.reward} 点奖励
                    </div>
                    {task.type === 'weekly' && (
                      <div className="text-sm bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        每周任务
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => task.progress === 100 ? handleUncompleteTask(task.id) : handleCompleteTask(task.id)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110
                    ${task.progress === 100 ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {task.progress === 100 ? '✓' : '○'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {newAchievementState && (
        <AchievementNotification
          achievement={newAchievementState}
          onClose={() => setNewAchievementState(null)}
        />
      )}
    </div>
  )
}
