'use client';

import { useCallback } from 'react';
import { useAppState } from '@/store/AppContext';


export function useAchievement() {
  const { state, dispatch } = useAppState();
  const { achievements } = state;

  const unlockedAchievements = achievements.unlocked;

  // 清除新成就提示
  const clearNewAchievement = useCallback(() => {
    dispatch({ type: 'SET_NEW_ACHIEVEMENT', payload: null });
  }, [dispatch]);

  return {
    unlockedAchievements,
    achievements: achievements.unlocked,
    newAchievement: achievements.new,
    clearNewAchievement,
  };
}
