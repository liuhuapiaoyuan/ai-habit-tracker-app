'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Navigation from '@/components/Navigation';
import { useWebDAV } from '@/hooks/useWebDAV';
import { useLocalSync } from '@/hooks/useLocalSync';
import { useTheme } from '@/providers/ThemeProvider';
import { syncService, useAppState } from "@/store/AppContext";

export default function Settings() {
  const { config: webdavConfig, saveConfig, testConnection, syncData, loadData } = useWebDAV();
  const { 
    config: localConfig, 
    isSupported, 
    selectDirectory,
    toggleAutoSync,
    restoreFromLocal 
  } = useLocalSync();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === 'dark';
  const {init:refreshStore}   = useAppState()
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('notifications') !== 'disabled';
    }
    return true;
  });

  const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);
  const [formData, setFormData] = useState({
    url: webdavConfig.url,
    username: webdavConfig.username,
    password: webdavConfig.password
  });
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const toggleDarkMode = () => {
    setTheme(darkMode ? 'light' : 'dark');
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    localStorage.setItem('notifications', !notifications ? 'enabled' : 'disabled');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);
    const result = await testConnection(formData);
    setMessage(result);
    setTesting(false);
  };

  const handleSave = () => {
    saveConfig(formData);
    setMessage({ success: true, message: '配置已保存！' });
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    const result = await syncData();
    setMessage(result);
    setSyncing(false);
  };

  const handleLoad = async () => {
    setSyncing(true);
    setMessage(null);
    const result = await loadData();
    setMessage(result);
    setSyncing(false);
  };

  const handleExport = async () => {
    try {
      const data = await syncService.export()

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habit-tracker-backup-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ success: true, message: '数据导出成功！' });
    } catch (error) {
      setMessage({ 
        success: false, 
        message: '数据导出失败: ' + ((error as Error).message || '未知错误')
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        syncService.import(data).then(()=>{
          refreshStore()
        })
        if (data.theme) {
          localStorage.setItem('theme', data.theme);
          if (data.theme === 'dark') {
            document.documentElement.classList.add('dark');
            setTheme('dark');
          } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
          }
        }
        if (data.notifications) {
          localStorage.setItem('notifications', data.notifications);
          setNotifications(data.notifications === 'enabled');
        }
        setMessage({ success: true, message: '数据导入成功！请刷新页面以查看更改。' });
      } catch (error) {
        setMessage({ 
          success: false, 
          message: '数据导入失败: ' + ((error as Error).message || '未知错误')
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-8">设置</h2>
        
        <div className="space-y-8">
          {/* 基本设置 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-cartoon">
            <h3 className="text-lg font-bold mb-4">基本设置</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">暗黑模式</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    切换应用的暗黑/明亮主题
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full 
                           transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-primary focus:ring-offset-2 ${
                             darkMode ? 'bg-primary' : 'bg-gray-200'
                           }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white 
                             transition-transform duration-200 ${
                               darkMode ? 'translate-x-6' : 'translate-x-1'
                             }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">通知提醒</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    开启/关闭成就解锁通知
                  </p>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full 
                           transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-primary focus:ring-offset-2 ${
                             notifications ? 'bg-primary' : 'bg-gray-200'
                           }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white 
                             transition-transform duration-200 ${
                               notifications ? 'translate-x-6' : 'translate-x-1'
                             }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* WebDAV 同步 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-cartoon">
            <h3 className="text-lg font-bold mb-4">WebDAV 同步</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">服务器地址</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/dav/"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">用户名</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">密码</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing ? '测试中...' : '测试连接'}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  保存配置
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSync}
                  disabled={syncing || !webdavConfig.url}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncing ? '同步中...' : '同步到 WebDAV'}
                </button>
                <button
                  onClick={handleLoad}
                  disabled={syncing || !webdavConfig.url}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncing ? '加载中...' : '从 WebDAV 加载'}
                </button>
              </div>
            </div>
          </div>

          {/* 本地同步 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-cartoon">
            <h3 className="text-lg font-bold mb-4">本地同步</h3>
            {isSupported ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={selectDirectory}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                  >
                    选择目录
                  </button>
                  <button
                  disabled={!localConfig.directory}
                    onClick={restoreFromLocal}
                    className="flex-1 px-4 py-2 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    bg-primary text-white rounded-lg hover:bg-opacity-90"
                  >
                    从本地恢复
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  当前目录: {localConfig.directory || '未选择'}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">自动同步</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      开启/关闭自动本地同步
                    </p>
                  </div>
                  <button disabled={!localConfig.directory}
                    onClick={toggleAutoSync}
                    className={`relative 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      inline-flex h-6 w-11 items-center rounded-full 
                             transition-colors duration-200 focus:outline-none focus:ring-2 
                             focus:ring-primary focus:ring-offset-2 ${
                               localConfig.autoSync ? 'bg-primary' : 'bg-gray-200'
                             }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white 
                               transition-transform duration-200 ${
                                 localConfig.autoSync ? 'translate-x-6' : 'translate-x-1'
                               }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                您的浏览器不支持本地同步功能
              </p>
            )}
          </div>

          {/* 数据管理 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-cartoon">
            <h3 className="text-lg font-bold mb-4">数据管理</h3>
            <div className="space-y-4">
              <div>
                <button
                  onClick={handleExport}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 
                           transition-colors duration-200"
                >
                  导出数据
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  将您的所有数据导出为JSON文件
                </p>
              </div>

              <div>
                <label className="block">
                  <span className="sr-only">选择文件</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:text-sm file:font-semibold
                             file:bg-primary file:text-white
                             hover:file:bg-opacity-90
                             cursor-pointer"
                  />
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  从JSON文件恢复数据
                </p>
              </div>
            </div>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.message}
            </div>
          )}

          {/* 关于 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-cartoon">
            <h3 className="text-lg font-bold mb-4">关于</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>习惯追踪器 v1.0.0</p>
              <p>一个帮助你培养好习惯的应用</p>
              <p>
                <a
                  href="https://github.com/yourusername/habit-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub 仓库
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}