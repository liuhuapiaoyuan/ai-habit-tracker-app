import { syncService, useAppState } from '@/store/AppContext';
import { useState, useCallback, useEffect } from 'react';

interface LocalConfig {
  directory: string | null;
  autoSync: boolean;
}

const CONFIG_KEY = 'local_sync_config';

export function useLocalSync() {
  const { init: refreshStore } = useAppState();
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [config, setConfig] = useState<LocalConfig>(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem(CONFIG_KEY);
      return savedConfig ? JSON.parse(savedConfig) : {  autoSync: false };
    }
    return {  autoSync: false };
  });

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'showDirectoryPicker' in window);
  }, []);

  const selectDirectory = useCallback(async () => {
    try {
      const handle = await window.showDirectoryPicker();
      const newConfig = { directory: handle.name, autoSync: config.autoSync };
      setDirectoryHandle(handle);
      setConfig(newConfig);
      return { success: true, message: '目录选择成功！' };
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return { success: false, message: '用户取消了选择。' };
      }
      return { 
        success: false, 
        message: '选择目录失败: ' + ((error as Error).message || '未知错误') 
      };
    }
  }, [config.autoSync]);

  const toggleAutoSync = useCallback(() => {
    const newConfig = { ...config, autoSync: !config.autoSync };
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ ...newConfig, directory: newConfig.directory }));
  }, [config]);

  const syncToLocal = useCallback(async () => {
    if (!directoryHandle) {
      return { success: false, message: '请先选择一个目录。' };
    }

    try {
      const syncData = await syncService.export();
      const data = {
        ...syncData,
        syncTime: new Date().toISOString()
      };

      const fileName = `habit-tracker-backup.json`;
      const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();

      return { success: true, message: '数据已保存到本地！' };
    } catch (error) {
      return { 
        success: false, 
        message: '保存失败: ' + ((error as Error).message || '未知错误') 
      };
    }
  }, [directoryHandle]);

  const restoreFromLocal = useCallback(async () => {
    if (!directoryHandle) {
      return { success: false, message: '请先选择一个目录。' };
    }

    try {
      const fileHandle = await directoryHandle.getFileHandle('habit-tracker-backup.json');
      const file = await fileHandle.getFile();
      const content = await file.text();
      const data = JSON.parse(content);

      await syncService.import(data);
      refreshStore();

      if (data.theme) localStorage.setItem('theme', data.theme);

      return { 
        success: true, 
        message: '数据已从本地恢复！请刷新页面以查看更改。' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: '恢复失败: ' + ((error as Error).message || '未知错误') 
      };
    }
  }, [directoryHandle, refreshStore]);

  useEffect(() => {
    if (config.autoSync && directoryHandle) {
      syncToLocal();
    }
  }, [config.autoSync, directoryHandle, syncToLocal]);

  return {
    config,
    isSupported,
    selectDirectory,
    toggleAutoSync,
    syncToLocal,
    restoreFromLocal
  };
}
