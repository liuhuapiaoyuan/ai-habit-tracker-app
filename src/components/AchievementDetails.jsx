import React from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function AchievementDetails({ achievement }) {
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-cartoon">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{achievement.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-primary">{achievement.title}</h3>
          <p className="text-gray-600">{achievement.description}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-medium">获得时间：</span>
          <span>{formatDate(achievement.earnedAt)}</span>
        </div>
        
        <div className="flex items-start gap-2 text-gray-600">
          <span className="font-medium">触发任务：</span>
          <div>
            <div className="font-medium text-primary">{achievement.triggerTask.title}</div>
            {achievement.triggerTask.description && (
              <div className="text-gray-500 mt-1">{achievement.triggerTask.description}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
