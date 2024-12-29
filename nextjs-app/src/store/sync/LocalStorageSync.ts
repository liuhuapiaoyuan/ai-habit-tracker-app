import { Task } from '@/types/task';
import { SyncInterface } from './SyncInterface';
import { AchievementRecord, TaskCompletion } from '@/types/state';

const STORAGE_KEYS = {
  TASKS: 'HABIT_TRACKER_tasks',
  COMPLETIONS: 'HABIT_TRACKER_task_completions',
  ACHIEVEMENTS: 'HABIT_TRACKER_achievements'
} as const;

/**
 * localStorage 实现的同步接口
 */
export class LocalStorageSync implements SyncInterface {
  async loadTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  async loadCompletions(): Promise<TaskCompletion[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading completions:', error);
      return [];
    }
  }

  async saveCompletions(completions: TaskCompletion[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
    } catch (error) {
      console.error('Error saving completions:', error);
      throw error;
    }
  }

  async loadAchievements(): Promise<AchievementRecord[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading achievements:', error);
      return [];
    }
  }

  async saveAchievements(achievements: AchievementRecord[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETIONS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  
  async export(): Promise<{ tasks: Task[], completions: TaskCompletion[], achievements: AchievementRecord[] }> {
    const tasks = await this.loadTasks();
    const completions = await this.loadCompletions();
    const achievements = await this.loadAchievements();
    return {
      tasks,
      completions,
      achievements
    };
  }

  async import(data: { tasks: Task[], completions: TaskCompletion[], achievements: AchievementRecord[] }): Promise<void> {
    await this.saveTasks(data.tasks);
    await this.saveCompletions(data.completions);
    await this.saveAchievements(data.achievements);
  }

}
