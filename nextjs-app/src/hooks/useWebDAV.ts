import { syncService, useAppState } from '@/store/AppContext';
import { useState, useCallback } from 'react';
import { createClient } from 'webdav';

interface WebDAVConfig {
  url: string;
  username: string;
  password: string;
}

const CONFIG_KEY = 'webdav_config';

export function useWebDAV() {
  const {init:refreshStore}   = useAppState()

  const [config, setConfig] = useState<WebDAVConfig>(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem(CONFIG_KEY);
      return savedConfig ? JSON.parse(savedConfig) : { url: '', username: '', password: '' };
    }
    return { url: '', username: '', password: '' };
  });

  const saveConfig = useCallback((newConfig: WebDAVConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
  }, []);

  const testConnection = useCallback(async (testConfig: WebDAVConfig) => {
    try {
      const client = createClient(testConfig.url, {
        username: testConfig.username,
        password: testConfig.password
      });

      await client.getDirectoryContents('/');
      return { success: true, message: '连接成功！' };
    } catch (error) {
      return { 
        success: false, 
        message: '连接失败: ' + ((error as Error).message || '未知错误') 
      };
    }
  }, []);

  const syncData = useCallback(async () => {
    try {
      const client = createClient(config.url, {
        username: config.username,
        password: config.password
      });
      const syncData = await syncService.export()
      const data = { 
        ...syncData,
        syncTime: new Date().toISOString()
      };

      await client.putFileContents('/habit-tracker-data.json', 
        JSON.stringify(data, null, 2), 
        { overwrite: true }
      );

      return { success: true, message: '数据同步成功！' };
    } catch (error) {
      return { 
        success: false, 
        message: '同步失败: ' + ((error as Error).message || '未知错误') 
      };
    }
  }, [config]);

  const loadData = useCallback(async () => {
    try {
      const client = createClient(config.url, {
        username: config.username,
        password: config.password
      });

      const content = await client.getFileContents('/habit-tracker-data.json', 
        { format: 'text' }
      );

      const data = JSON.parse(content as string);
      syncService.import(data).then(()=>{
        refreshStore()
      })
      if (data.theme) localStorage.setItem('theme', data.theme);

      return { 
        success: true, 
        message: '数据加载成功！请刷新页面以查看更改。' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: '加载失败: ' + ((error as Error).message || '未知错误') 
      };
    }
  }, [config]);

  return {
    config,
    saveConfig,
    testConnection,
    syncData,
    loadData
  };
}
