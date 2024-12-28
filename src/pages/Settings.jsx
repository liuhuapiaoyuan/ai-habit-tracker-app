import React, { useState } from 'react'
import { format } from 'date-fns'
import { useWebDAV } from '../hooks/useWebDAV'

export default function Settings() {
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

  const handleExport = () => {
    try {
      const data = {
        tasks: localStorage.getItem('user-habit-tracker-tasks'),
        achievements: localStorage.getItem('user_achievements'),
        webdav: localStorage.getItem('webdav_config'),
        exportTime: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `habit-tracker-backup-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ success: true, message: '数据导出成功！' })
    } catch (error) {
      setMessage({ 
        success: false, 
        message: '数据导出失败: ' + (error.message || '未知错误') 
      })
    }
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // 恢复数据
        if (data.tasks) localStorage.setItem('user-habit-tracker-tasks', data.tasks)
        if (data.achievements) localStorage.setItem('user_achievements', data.achievements)
        if (data.webdav) localStorage.setItem('webdav_config', data.webdav)

        setMessage({ success: true, message: '数据导入成功！请刷新页面以加载新数据。' })
        
        // 3秒后刷新页面
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } catch (error) {
        setMessage({ 
          success: false, 
          message: '数据导入失败: ' + (error.message || '未知错误') 
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8">设置</h2>

      {/* WebDAV 配置 */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-6">WebDAV 同步</h3>
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
            <div className="border-t border-gray-200 mt-4 pt-4">
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
          )}
        </div>
      </div>

      {/* 数据导入导出 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-6">数据备份</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
            >
              导出数据
            </button>
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <span className="block px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-center cursor-pointer">
                导入数据
              </span>
            </label>
          </div>
          <p className="text-sm text-gray-500">
            导出的数据包含您的所有任务、成就和设置信息。您可以将导出的文件保存在安全的地方，需要时随时导入恢复。
          </p>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg ${
          message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.message}
        </div>
      )}
    </div>
  )
}
