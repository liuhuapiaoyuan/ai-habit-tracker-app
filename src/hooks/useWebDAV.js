import { useState, useCallback } from 'react'
import { createClient } from 'webdav'

const STORAGE_KEY = 'webdav_config'

export function useWebDAV() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
      url: '',
      username: '',
      password: '',
      lastSync: null,
      isConfigured: false
    }
  })

  const saveConfig = useCallback((newConfig) => {
    const configToSave = {
      ...newConfig,
      isConfigured: true,
      lastSync: config.lastSync
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave))
    setConfig(configToSave)
  }, [config.lastSync])

  const testConnection = useCallback(async (testConfig) => {
    try {
      const client = createClient(testConfig.url, {
        username: testConfig.username,
        password: testConfig.password
      })

      // 测试连接
      await client.getDirectoryContents('/')
      return { success: true, message: '连接成功！' }
    } catch (error) {
      console.error('WebDAV 连接测试失败:', error)
      return { 
        success: false, 
        message: '连接失败: ' + (error.message || '未知错误')
      }
    }
  }, [])

  const syncData = useCallback(async () => {
    if (!config.isConfigured) {
      throw new Error('请先配置 WebDAV')
    }

    try {
      const client = createClient(config.url, {
        username: config.username,
        password: config.password
      })

      // 准备同步的数据
      const data = {
        tasks: localStorage.getItem('user-habit-tracker-tasks'),
        achievements: localStorage.getItem('user_achievements'),
        syncTime: new Date().toISOString()
      }

      // 检查并创建目录
      const dirExists = await client.exists('/habit-tracker')
      if (!dirExists) {
        await client.createDirectory('/habit-tracker')
      }

      // 上传数据
      await client.putFileContents(
        '/habit-tracker/data.json',
        JSON.stringify(data),
        { overwrite: true }
      )

      // 更新最后同步时间
      const newConfig = {
        ...config,
        lastSync: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
      setConfig(newConfig)

      return { success: true, message: '同步成功！' }
    } catch (error) {
      console.error('同步失败:', error)
      return { 
        success: false, 
        message: '同步失败: ' + (error.message || '未知错误')
      }
    }
  }, [config])

  const loadData = useCallback(async () => {
    if (!config.isConfigured) {
      throw new Error('请先配置 WebDAV')
    }

    try {
      const client = createClient(config.url, {
        username: config.username,
        password: config.password
      })

      // 检查文件是否存在
      const exists = await client.exists('/habit-tracker/data.json')
      if (!exists) {
        return { success: false, message: '没有找到同步数据' }
      }

      // 下载数据
      const content = await client.getFileContents('/habit-tracker/data.json', {
        format: 'text'
      })
      const data = JSON.parse(content)

      // 恢复数据
      if (data.tasks) localStorage.setItem('user-habit-tracker-tasks', data.tasks)
      if (data.achievements) localStorage.setItem('user_achievements', data.achievements)

      // 更新最后同步时间
      const newConfig = {
        ...config,
        lastSync: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
      setConfig(newConfig)

      return { success: true, message: '数据恢复成功！' }
    } catch (error) {
      console.error('数据恢复失败:', error)
      return { 
        success: false, 
        message: '数据恢复失败: ' + (error.message || '未知错误')
      }
    }
  }, [config])

  return {
    config,
    saveConfig,
    testConnection,
    syncData,
    loadData
  }
}
