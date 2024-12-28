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
          <p className="text-gray-600 mb-6">您还没有任何待办任务，让我们开始吧！</p>
          <div className="flex flex-col space-y-4 max-w-xs mx-auto">
            <Link
              to="/manage"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              创建新任务
            </Link>
            <Link
              to="/manage"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            >
              从市场导入
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const uncompletedTasks = todayTasks.filter(t => t.progress < 100)
  const completedTasks = todayTasks.filter(t => t.progress === 100)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 顶部状态栏 */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">今日待办</h2>
          <Link 
            to="/manage" 
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            管理任务
          </Link>
        </div>
        <div className="text-gray-600">
          {getMotivationalMessage(uncompletedCount)}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {uncompletedTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {task.type === 'daily' ? '每日任务' : '每周任务'}
                    </span>
                    <div className="h-1 flex-1 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {task.progress}%
                    </span>
                  </div>
                </div>
                <div className="ml-6">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 shadow-md"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {completedTasks.length > 0 && (
          <div className="mt-8">
            <motion.h2 
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              今日已完成
              <span className="text-green-500 text-lg">
                ({completedTasks.length} 个) 🎉
              </span>
            </motion.h2>
            <div>
              <AnimatePresence>
                {completedTasks.map(task => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ 
                      opacity: 0, 
                      y: 20,
                      scale: 0.8
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.2 }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1
                    }}
                    className="bg-white rounded-xl p-6 shadow-lg opacity-75 mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {task.type === 'daily' ? '每日任务' : '每周任务'}
                          </span>
                          <div className="h-1 flex-1 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <button
                          onClick={() => handleUncompleteTask(task.id)}
                          className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors duration-200 shadow-md"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {todayTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              今天还没有待办任务，去添加一些吧！
            </p>
            <Link 
              to="/manage" 
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              添加任务
            </Link>
          </div>
        )}
      </div>

      {newAchievement && (
        <AchievementNotification 
          achievement={newAchievement} 
          onClose={() => clearNewAchievement()} 
        />
      )}
    </div>
  )
}
