import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'user-habit-tracker-tasks'

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY)
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, task])
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const completeTask = useCallback((taskId) => {
    const completedAt = new Date().toISOString()
    
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (!task) return prev

      const updatedTasks = prev.map(t => 
        t.id === taskId ? {
          ...t,
          progress: 100,
          completedAt,
          completedDates: [...(t.completedDates || []), completedAt]
        } : t
      )

      return updatedTasks
    })

    // 返回更新后的任务，用于成就检查
    return tasks.map(t => 
      t.id === taskId ? {
        ...t,
        progress: 100,
        completedAt,
        completedDates: [...(t.completedDates || []), completedAt]
      } : t
    )
  }, [tasks])

  const uncompleteTask = useCallback((taskId) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (!task) return prev

      const updatedTasks = prev.map(t => 
        t.id === taskId ? {
          ...t,
          progress: 0,
          completedAt: null,
          completedDates: (t.completedDates || []).slice(0, -1)
        } : t
      )

      return updatedTasks
    })

    // 返回更新后的任务，用于成就检查
    return tasks.map(t => 
      t.id === taskId ? {
        ...t,
        progress: 0,
        completedAt: null,
        completedDates: (t.completedDates || []).slice(0, -1)
      } : t
    )
  }, [tasks])

  return { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask,
    completeTask,
    uncompleteTask
  }
}
