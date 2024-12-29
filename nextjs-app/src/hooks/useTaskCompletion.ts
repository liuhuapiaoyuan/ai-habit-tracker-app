'use client';

import { useCallback } from 'react';
import { useAppState } from '@/store/AppContext';


export function useTaskCompletion() {
  const { state, completeTask,uncompleteTask } = useAppState();
  const { completions } = state;
 

  // 获取今天已完成的任务
  const getTodayCompletions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return completions.filter(completion => 
      completion.completedAt.startsWith(today)
    );
  }, [completions]);

  // 检查任务今天是否已完成
  const isTaskCompletedToday = useCallback((taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(
      completion => completion.taskId === taskId && completion.completedAt.startsWith(today)
    );
  }, [completions]);

  return {
    completions,
    completeTask,
    uncompleteTask,
    getTodayCompletions,
    isTaskCompletedToday
  };
}
