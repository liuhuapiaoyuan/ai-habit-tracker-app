'use client';

import { useCallback, useMemo } from 'react';
import { useAppState } from '@/store/AppContext';
import { useTaskCompletion } from './useTaskCompletion';

export function useTasks(){
  const { state, setTasks, addTasks, updateTask, deleteTask } = useAppState();
  const { tasks, completions } = state;
  
  const todayTasks = tasks.filter(task => 
    (task.type === 'daily' || 
    (task.type === 'weekly' && task.days?.includes(new Date().getDay())))
  );
  const {getTodayCompletions} = useTaskCompletion()
  // 获取今天的任务完成进度信息
  const getTodayProgress = useCallback(() => {
 
    const todayCompletions =getTodayCompletions()
    
    return {
      total: todayTasks.length,
      completed: todayCompletions.length,
      percentage: todayTasks.length ? (todayCompletions.length / todayTasks.length) * 100 : 0
    };
  }, [getTodayCompletions, todayTasks.length]);

  // 根据完成进度获取鼓励语句
  const getTodayMessage = useCallback(() => {
    const progress = getTodayProgress();
    
    // 没有任务的情况
    if (progress.total === 0) {
      return ' 🤔 还没有设置今日任务呢，去添加一些吧！';
    }

    // 根据完成百分比选择不同的消息
    if (progress.completed === 0) {
      const messages = [
        ' 🌞 新的一天开始啦！准备好开始完成任务了吗？',
        ' 💪 早安！让我们开始今天的任务吧！',
        ' 💫 相信自己，你可以完成所有任务！',
        ' 💪 准备好了吗？让我们开始吧！',
        ' 🎉 今天是新的开始！',
        ' 💥  Go Go Go！',
        ' 🎉  Let\'s do it！'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (progress.percentage < 25) {
      const messages = [
        ` 💪 已经完成了 ${progress.completed} 个任务，继续加油！`,
        ' 🔥 保持这个节奏，你正在走向成功！',
        ' 💪 每完成一个任务都是进步！',
        ` 💪 完成度 ${progress.percentage.toFixed(0)}%，继续前进！`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (progress.percentage < 50) {
      const messages = [
        ` 🎉 太棒了！已经完成了 ${progress.percentage.toFixed(0)}% 的任务！`,
        ' 🔥 超过一半啦！冲刺最后几个任务吧！',
        ' 💪 你已经很接近目标了，继续加油！',
        ` 💪 完成了 ${progress.completed} 个任务，就差一点点啦！`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (progress.percentage < 75) {
      const messages = [
        ` 💥 太了不起了！已经完成了 ${progress.percentage.toFixed(0)}% 的任务！`,
        ' 🔥 你已经很接近目标了，继续加油！',
        ' 💪 你已经很接近目标了，继续加油！',
        ` 💥 完成了 ${progress.completed} 个任务，就差一点点啦！`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (progress.percentage < 100) {
      const messages = [
        ` 🎉 今天你已经完成了 ${progress.percentage.toFixed(0)}% 的任务！`,
        ' 🔥 你已经很接近目标了，继续加油！',
        ' 💪 你已经很接近目标了，继续加油！',
        ` 💪 完成了 ${progress.completed} 个任务，就差一点点啦！`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // 全部完成
    const messages = [
      ' 🎉  Congratulations！你今天的表现真是太棒了！',
      ' 🎉  Well done！你今天的进度太了不起了！',
      ' 🎉  You are the best！你今天的表现真是太棒了！',
      ' 🎉  You did it！你今天的进度太了不起了！'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [getTodayProgress]);

  // 获取当前时间的图标
  const timeIcon = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return ' ☀️'; // 白天
    } else {
      return ' 🌃'; // 夜晚
    }
  }, []);

  return {
    todayTasks,
    tasks,
    setTasks,
    addTasks,
    updateTask,
    deleteTask,
    getTodayMessage,
    timeIcon,
    getTodayProgress
  };
}