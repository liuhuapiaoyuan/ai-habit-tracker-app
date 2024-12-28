import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const TaskEditModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(task)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    onSave(editedTask)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">编辑任务</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">标题</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">奖励点数</label>
            <input
              type="number"
              name="reward"
              value={editedTask.reward}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              max="5"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            保存
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TaskEditModal
