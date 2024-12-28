import React from 'react'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const AchievementModal = ({ achievement, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {achievement.icon}
          </div>
          <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
          <p className="text-gray-600 mb-4">{achievement.description}</p>
          
          {achievement.earnedAt && (
            <div className="mb-4 text-sm text-gray-500">
              于 {format(new Date(achievement.earnedAt), 'PPpp', { locale: zhCN })} 获得
            </div>
          )}
          
          {achievement.triggerTask && (
            <div className="mb-4 text-sm">
              <div className="text-gray-500 mb-1">触发任务：</div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">{achievement.triggerTask.title}</div>
                {achievement.triggerTask.description && (
                  <div className="text-gray-500">{achievement.triggerTask.description}</div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 active:bg-opacity-80 transition-all duration-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AchievementModal
