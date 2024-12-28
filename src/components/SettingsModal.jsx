import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { useWebDAV } from '../hooks/useWebDAV'

export default function SettingsModal({ isOpen, onClose }) {
  const { config, saveConfig, testConnection, syncData, loadData } = useWebDAV()
  const [formData, setFormData] = useState({
    url: config.url,
    username: config.username,
    password: config.password
  })
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTest = async () => {
    setTesting(true)
    setMessage(null)
    const result = await testConnection(formData)
    setMessage(result)
    setTesting(false)
  }

  const handleSave = () => {
    saveConfig(formData)
    setMessage({ success: true, message: '配置已保存！' })
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage(null)
    const result = await syncData()
    setMessage(result)
    setSyncing(false)
  }

  const handleLoad = async () => {
    setSyncing(true)
    setMessage(null)
    const result = await loadData()
    setMessage(result)
    setSyncing(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">设置</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WebDAV 服务地址
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/dav"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${
              message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleTest}
              disabled={testing || !formData.url || !formData.username || !formData.password}
              className={`flex-1 px-4 py-2 rounded-lg ${
                testing || !formData.url || !formData.username || !formData.password
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {testing ? '测试中...' : '测试连接'}
            </button>

            <button
              onClick={handleSave}
              disabled={!formData.url || !formData.username || !formData.password}
              className={`flex-1 px-4 py-2 rounded-lg ${
                !formData.url || !formData.username || !formData.password
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              保存配置
            </button>
          </div>

          {config.isConfigured && (
            <>
              <div className="border-t border-gray-200 my-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    上次同步: {config.lastSync 
                      ? format(new Date(config.lastSync), 'yyyy-MM-dd HH:mm:ss')
                      : '从未同步'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      syncing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {syncing ? '同步中...' : '上传数据'}
                  </button>
                  <button
                    onClick={handleLoad}
                    disabled={syncing}
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      syncing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {syncing ? '同步中...' : '恢复数据'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
