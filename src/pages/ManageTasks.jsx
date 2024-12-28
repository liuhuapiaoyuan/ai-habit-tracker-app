import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTasks } from '../hooks/useTasks'
import { format } from 'date-fns'
import ConfirmationModal from '../components/ConfirmationModal'
import MarketModal from '../components/MarketModal'
import TaskEditModal from '../components/TaskEditModal'
import TaskCard from '../components/TaskCard'
import { habitMarket } from '../config/market'
import { AnimatePresence } from 'framer-motion'

export default function ManageTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showMarketModal, setShowMarketModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'daily',
    days: [],
    reward: 3,
    icon: '📝'
  })

  const handleCreateTask = () => {
    addTask({
      ...newTask,
      id: uuidv4(),
      progress: 0,
      completedDates: []
    })
    setNewTask({
      title: '',
      description: '',
      type: 'daily',
      days: [],
      reward: 3,
      icon: '📝'
    })
    setShowCreateForm(false)
  }

  const handleDeleteTask = (id) => {
    deleteTask(id)
    setTaskToDelete(null)
  }

  const handleEditTask = (updatedTask) => {
    updateTask(updatedTask.id, updatedTask)
    setTaskToEdit(null)
  }

  const handleImportFromMarket = (product) => {
    product.tasks.forEach(task => {
      addTask({
        ...task,
        id: uuidv4(),
        progress: 0,
        completedDates: [],
        days: task.days || []
      })
    })
    setShowMarketModal(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">管理任务</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowMarketModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            从市场导入
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            创建任务
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setTaskToEdit}
              onDelete={setTaskToDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {showCreateForm && (
        <TaskEditModal
          task={newTask}
          onSave={handleCreateTask}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {taskToEdit && (
        <TaskEditModal
          task={taskToEdit}
          onSave={handleEditTask}
          onClose={() => setTaskToEdit(null)}
        />
      )}

      {taskToDelete && (
        <ConfirmationModal
          message={`确定要删除任务"${taskToDelete.title}"吗？`}
          onConfirm={() => handleDeleteTask(taskToDelete.id)}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {showMarketModal && (
        <MarketModal
          market={habitMarket}
          onSelect={handleImportFromMarket}
          onClose={() => setShowMarketModal(false)}
        />
      )}
    </div>
  )
}
