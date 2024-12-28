import React from 'react'

const AchievementBadge = ({ achievement, unlocked, onClick }) => {
  return (
    <div 
      className={`relative w-24 h-24 rounded-full p-1 cursor-pointer transition-all duration-300 ${
        unlocked ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
      }`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg" />
      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
        <div className="text-4xl">
          {achievement.icon}
        </div>
      </div>
      {unlocked && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
          ✓
        </div>
      )}
    </div>
  )
}

export default AchievementBadge
