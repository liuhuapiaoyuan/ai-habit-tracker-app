import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const defaultEmojis = ['📚', '✍️', '🔢', '📝', '🎒', '📖', '🧮', '📔', '🔤', '😴', '🏃', '💧', '⚖️', '🎯', '🧘', '🙏', '💪', '🎨', '🎵', '🌱']

const TaskEditModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState({
    ...task,
    icon: task.icon || '📝' // 设置默认图标
  })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmojiSelect = (emoji) => {
    setEditedTask(prev => ({
      ...prev,
      icon: emoji
    }))
    setShowEmojiPicker(false)
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
          <div className="flex gap-2 items-start">
            <div className="flex-1">
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
              <label className="block text-sm font-medium mb-1">图标</label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-10 h-10 border rounded flex items-center justify-center text-xl hover:bg-gray-50"
              >
                {editedTask.icon}
              </button>
            </div>
          </div>

          {showEmojiPicker && (
            <div className="border rounded p-2 grid grid-cols-10 gap-1">
              {defaultEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">类型</label>
            <select
              name="type"
              value={editedTask.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="daily">每日任务</option>
              <option value="weekly">每周任务</option>
            </select>
          </div>

          {editedTask.type === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-1">重复日期</label>
              <div className="grid grid-cols-7 gap-2">
                {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const days = editedTask.days || []
                      const newDays = days.includes(index)
                        ? days.filter(d => d !== index)
                        : [...days, index]
                      setEditedTask(prev => ({
                        ...prev,
                        days: newDays
                      }))
                    }}
                    className={`p-2 text-sm rounded ${
                      (editedTask.days || []).includes(index)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TaskEditModal
