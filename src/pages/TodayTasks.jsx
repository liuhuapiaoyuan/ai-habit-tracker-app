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
  const [shakeTaskId, setShakeTaskId] = useState(null)

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

    setShakeTaskId(taskId)
    setTimeout(() => setShakeTaskId(null), 500)
    
    const updatedTasks = completeTask(taskId)
  }

  const handleUncompleteTask = (taskId) => {
    const task = todayTasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTasks = uncompleteTask(taskId)
  }

  const getMotivationalMessage = (uncompletedCount) => {
    const completeMessages = [
      '太棒了！今天的任务都完成了！继续保持这份热情吧！🎉✨',
      '哇！完美达成今日目标，你就是最闪亮的星星！⭐️',
      '任务全部完成啦！这份坚持，未来的你一定会感谢现在的自己！🌈',
      '全部搞定！今天也是努力生活的一天呢！🌸',
      '好厉害！今天的你也是如此耀眼呢！🌟',
      '完美收官！休息一下，好好犒劳自己吧！🎊'
    ]

    const almostMessages = [
      '就差最后一个任务了，加油！你离成功只有一步之遥！💪',
      '马上就要完成啦！这份坚持真的很了不起！🌟',
      '最后一个任务了！让我们一起冲刺终点吧！🏃‍♂️✨',
      '还有一个小目标，你已经做得很棒啦！🎯',
      '即将大功告成！期待看到你的完美收官！🌈'
    ]

    const progressMessages = [
      `还有 ${uncompletedCount} 个任务等待完成，你一定可以的！🌟`,
      `已经完成了这么多，继续加油吧！剩下 ${uncompletedCount} 个就搞定啦！💫`,
      `慢慢来，保持这份热情，还有 ${uncompletedCount} 个小目标等着你！🌈`,
      `每完成一个都是进步，还有 ${uncompletedCount} 个任务，我们一起加油！✨`,
      `相信自己，${uncompletedCount} 个任务对你来说不在话下！🎯`,
      `今天也在努力呢！剩下 ${uncompletedCount} 个任务，让我们一起向前进吧！🚀`
    ]

    if (uncompletedCount === 0) {
      return completeMessages[Math.floor(Math.random() * completeMessages.length)]
    }
    if (uncompletedCount === 1) {
      return almostMessages[Math.floor(Math.random() * almostMessages.length)]
    }
    return progressMessages[Math.floor(Math.random() * progressMessages.length)]
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

        .shadow-success {
          box-shadow: 0 0 10px rgba(72, 187, 120, 0.3),
                     0 0 20px rgba(72, 187, 120, 0.2),
                     0 0 30px rgba(72, 187, 120, 0.1);
        }

        @keyframes task-glow {
          from {
            box-shadow: 0 0 10px rgba(72, 187, 120, 0.3),
                       0 0 20px rgba(72, 187, 120, 0.2),
                       0 0 30px rgba(72, 187, 120, 0.1);
          }
          to {
            box-shadow: 0 0 15px rgba(72, 187, 120, 0.4),
                       0 0 30px rgba(72, 187, 120, 0.3),
                       0 0 45px rgba(72, 187, 120, 0.2);
          }
        }

        .animate-glow {
          animation: task-glow 1.5s ease-in-out infinite alternate;
        }
      `}</style>

      <div className="bg-white p-6 rounded-lg shadow-cartoon mb-6">
        <p className="text-center text-gray-600">{getMotivationalMessage(uncompletedCount)}</p>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {todayTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={task.progress === 100 ? {
                opacity: 1,
                y: 0,
                scale: [1, 1.05, 0.95, 1.05, 0.95, 1],
                x: [0, -15, 15, -15, 15, -8, 8, 0],
              } : shakeTaskId === task.id ? {
                opacity: 1,
                y: 0,
                rotate: [0, -5, 5, -3, 3, 0]
              } : {
                opacity: 1,
                y: 0
              }}
              transition={shakeTaskId === task.id ? {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.2, 0.4, 0.6, 0.8, 1]
              } : {
                duration: 0.8,
                ease: "easeInOut",
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1]
              }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-white p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] 
                ${task.progress === 100 
                  ? 'shadow-success animate-glow' 
                  : 'shadow-cartoon'}`}
              onClick={() => task.progress === 100 
                ? handleUncompleteTask(task.id) 
                : handleCompleteTask(task.id)}
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

      <style>{`
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

        .shadow-success {
          box-shadow: 0 0 10px rgba(72, 187, 120, 0.3),
                     0 0 20px rgba(72, 187, 120, 0.2),
                     0 0 30px rgba(72, 187, 120, 0.1);
        }

        @keyframes task-glow {
          from {
            box-shadow: 0 0 10px rgba(72, 187, 120, 0.3),
                       0 0 20px rgba(72, 187, 120, 0.2),
                       0 0 30px rgba(72, 187, 120, 0.1);
          }
          to {
            box-shadow: 0 0 15px rgba(72, 187, 120, 0.4),
                       0 0 30px rgba(72, 187, 120, 0.3),
                       0 0 45px rgba(72, 187, 120, 0.2);
          }
        }

        .animate-glow {
          animation: task-glow 1.5s ease-in-out infinite alternate;
        }

        @keyframes shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }

        .shake-animation {
          animation: shake 0.4s ease-in-out;
          transform-origin: center;
        }
      `}</style>

      {newAchievementState && (
        <AchievementNotification
          achievement={newAchievementState}
          onClose={() => setNewAchievementState(null)}
        />
      )}
    </div>
  )
}
