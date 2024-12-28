import React from 'react'
import { motion } from 'framer-motion'

const TaskCard = ({ task, onEdit, onDelete, showActions = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-4 rounded-lg shadow-cartoon hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
          {task.icon || '📝'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className={`
              text-sm px-2 py-0.5 rounded-full
              ${task.reward >= 4 ? 'bg-purple-100 text-purple-700' :
                task.reward >= 3 ? 'bg-blue-100 text-blue-700' :
                task.reward >= 2 ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'}
            `}>
              {task.reward} 点奖励
            </div>
            <div className={`
              text-sm px-2 py-0.5 rounded-full
              ${task.type === 'weekly' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}
            `}>
              {task.type === 'weekly' ? '每周任务' : '每日任务'}
            </div>
            {task.type === 'weekly' && task.days && task.days.length > 0 && (
              <div className="text-sm text-gray-500">
                {task.days.map(day => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day]).join('、')}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <button
            onClick={() => onEdit(task)}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            <span>✏️</span>
            编辑
          </button>
          <button
            onClick={() => onDelete(task)}
            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
          >
            <span>🗑️</span>
            删除
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default TaskCard
