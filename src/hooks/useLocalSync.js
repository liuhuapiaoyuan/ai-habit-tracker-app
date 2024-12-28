import { useState, useCallback } from 'react'
import { format } from 'date-fns'

const STORAGE_KEY = 'local_sync_config'

export function useLocalSync() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
      handle: null,
      lastSync: null,
      isConfigured: false
    }
  })

  // 检查浏览器是否支持 File System Access API
  const isSupported = useCallback(() => {
    return 'showDirectoryPicker' in window
  }, [])

  // 选择目录
  const selectDirectory = useCallback(async () => {
    try {
      if (!isSupported()) {
        throw new Error('您的浏览器不支持目录访问功能，请使用最新版本的 Chrome、Edge 或其他现代浏览器。')
      }

      const handle = await window.showDirectoryPicker({
        mode: 'readwrite'
      })

      // 验证权限
      const permissionResult = await handle.requestPermission({
        mode: 'readwrite'
      })

      if (permissionResult !== 'granted') {
        throw new Error('需要目录访问权限才能进行同步')
      }

      const newConfig = {
        handle,
        lastSync: null,
        isConfigured: true
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastSync: null,
        isConfigured: true
      }))
      setConfig(newConfig)

      return { success: true, message: '目录配置成功！' }
    } catch (error) {
      console.error('选择目录失败:', error)
      return { 
        success: false, 
        message: '选择目录失败: ' + (error.message || '未知错误') 
      }
    }
  }, [isSupported])

  // 同步数据到本地目录
  const syncToLocal = useCallback(async () => {
    if (!config.handle) {
      throw new Error('请先选择同步目录')
    }

    try {
      // 准备同步的数据
      const data = {
        tasks: localStorage.getItem('user-habit-tracker-tasks'),
        achievements: localStorage.getItem('user_achievements'),
        webdav: localStorage.getItem('webdav_config'),
        syncTime: new Date().toISOString()
      }

      // 创建备份文件
      const fileName = `backup-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`
      const fileHandle = await config.handle.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(data, null, 2))
      await writable.close()

      // 更新最后同步时间
      const newConfig = {
        ...config,
        lastSync: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastSync: newConfig.lastSync,
        isConfigured: true
      }))
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

  // 从本地目录恢复数据
  const restoreFromLocal = useCallback(async () => {
    if (!config.handle) {
      throw new Error('请先选择同步目录')
    }

    try {
      // 获取目录中的所有文件
      const files = []
      for await (const entry of config.handle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          files.push(entry)
        }
      }

      if (files.length === 0) {
        throw new Error('没有找到备份文件')
      }

      // 按文件名排序（实际上是按时间排序，因为文件名包含时间戳）
      files.sort((a, b) => b.name.localeCompare(a.name))

      // 读取最新的备份文件
      const fileHandle = await config.handle.getFileHandle(files[0].name)
      const file = await fileHandle.getFile()
      const content = await file.text()
      const data = JSON.parse(content)

      // 恢复数据
      if (data.tasks) localStorage.setItem('user-habit-tracker-tasks', data.tasks)
      if (data.achievements) localStorage.setItem('user_achievements', data.achievements)
      if (data.webdav) localStorage.setItem('webdav_config', data.webdav)

      // 更新最后同步时间
      const newConfig = {
        ...config,
        lastSync: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastSync: newConfig.lastSync,
        isConfigured: true
      }))
      setConfig(newConfig)

      return { 
        success: true, 
        message: `成功从 ${files[0].name} 恢复数据！请刷新页面以加载新数据。` 
      }
    } catch (error) {
      console.error('恢复失败:', error)
      return { 
        success: false, 
        message: '恢复失败: ' + (error.message || '未知错误') 
      }
    }
  }, [config])

  return {
    config,
    isSupported,
    selectDirectory,
    syncToLocal,
    restoreFromLocal
  }
}
