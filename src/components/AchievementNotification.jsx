import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const AchievementNotification = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-xl overflow-hidden"
          style={{ maxWidth: '400px' }}
        >
          <div className="bg-gradient-to-r from-primary to-primary-dark p-1">
            <div className="bg-white p-4 flex items-center space-x-4">
              <div className="text-4xl">{achievement.icon}</div>
              <div>
                <div className="text-xs text-primary font-medium mb-1">
                  新成就解锁！
                </div>
                <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default AchievementNotification
