import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid' // 引入 uuid
import { useTasks } from '../hooks/useTasks'
import { format } from 'date-fns'
import ConfirmationModal from '../components/ConfirmationModal'
import MarketModal from '../components/MarketModal'
import TaskEditModal from '../components/TaskEditModal'
import { habitMarket } from '../config/market'

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
    reward: 3
  })

  const handleCreateTask = () => {
    addTask({
      ...newTask,
      id: uuidv4(), // 使用 uuid 生成唯一 ID
      progress: 0,
      completedDates: []
    })
    setNewTask({
      title: '',
      description: '',
      type: 'daily',
      days: [],
      reward: 3
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
        id: uuidv4(), // 使用 uuid 生成唯一 ID
        progress: 0,
        completedDates: []
      })
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">管理任务</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex-1 bg-primary text-white p-2 rounded hover:bg-opacity-90"
        >
          {showCreateForm ? '隐藏创建表单' : '创建新任务'}
        </button>
        <button
          onClick={() => setShowMarketModal(true)}
          className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          从市场导入
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-4 rounded-lg shadow-cartoon mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="任务标题"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="任务描述"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <select
              value={newTask.type}
              onChange={(e) => setNewTask({...newTask, type: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="daily">每日</option>
              <option value="weekly">每周</option>
            </select>
            {newTask.type === 'weekly' && (
              <div className="flex gap-2">
                {[0,1,2,3,4,5,6].map(day => (
                  <button
                    key={day}
                    onClick={() => setNewTask({
                      ...newTask,
                      days: newTask.days.includes(day) 
                        ? newTask.days.filter(d => d !== day)
                        : [...newTask.days, day]
                    })}
                    className={`p-2 rounded ${
                      newTask.days.includes(day) 
                        ? 'bg-secondary text-white' 
                        : 'bg-gray-200'
                    }`}
                  >
                    {format(new Date().setDate(new Date().getDate() - new Date().getDay() + day), 'EEE')}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>奖励点数:</span>
              <input
                type="number"
                min="1"
                max="5"
                value={newTask.reward}
                onChange={(e) => setNewTask({...newTask, reward: parseInt(e.target.value)})}
                className="w-20 p-2 border rounded"
              />
            </div>
            <button
              onClick={handleCreateTask}
              className="w-full bg-secondary text-white p-2 rounded hover:bg-opacity-90"
            >
              添加任务
            </button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">任务列表</h3>
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white p-4 rounded-lg shadow-cartoon cursor-pointer"
              onClick={() => setTaskToEdit(task)}
            >
              <h4 className="font-bold">{task.title}</h4>
              <p className="text-sm mb-2">{task.description}</p>
              <div className="flex justify-between items-center">
                <span>奖励点数: {task.reward}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTaskToDelete(task.id)
                  }}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {taskToDelete && (
        <ConfirmationModal
          message="您确定要删除这个任务吗？此操作无法撤销。"
          onConfirm={() => handleDeleteTask(taskToDelete)}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {taskToEdit && (
        <TaskEditModal
          task={taskToEdit}
          onSave={handleEditTask}
          onClose={() => setTaskToEdit(null)}
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
