import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TodayTasks from './pages/TodayTasks'
import History from './pages/History'
import ManageTasks from './pages/ManageTasks'
import AchievementsPage from './pages/Achievements'
import { useTasks } from './hooks/useTasks'
import { useAchievements } from './hooks/useAchievements'
import AchievementNotification from './components/AchievementNotification'
import Settings from './pages/Settings'

const pageVariants = {
  initial: { opacity: 0, x: '-100%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '100%' }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
}

function App() {
  const { tasks, updateTask } = useTasks()
  const { unlockedAchievements } = useAchievements(tasks)
  const [newAchievement, setNewAchievement] = useState(null)
  const location = useLocation()

  const completeTask = (id) => {
    updateTask(id, { 
      progress: 100,
      completedDates: [...tasks.find(t => t.id === id).completedDates, new Date().toISOString()]
    })
  }

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">习惯追踪</h1>
      
      <nav className="flex justify-around mb-8">
        <Link to="/" className="p-2 hover:text-primary">今日待办</Link>
        <Link to="/history" className="p-2 hover:text-primary">完成记录</Link>
        <Link to="/manage" className="p-2 hover:text-primary">管理任务</Link>
        <Link to="/achievements" className="p-2 hover:text-primary">成就</Link>
        <Link
          to="/settings"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg 
            className="w-6 h-6 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </nav>

      {newAchievement && (
        <AchievementNotification 
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TodayTasks completeTask={completeTask} />
            </motion.div>
          } />
          <Route path="/history" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <History />
            </motion.div>
          } />
          <Route path="/manage" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ManageTasks />
            </motion.div>
          } />
          <Route path="/achievements" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <AchievementsPage tasks={tasks} />
            </motion.div>
          } />
          <Route path="/settings" element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Settings />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
