import { Task } from '@/types/task';
import { TaskCompletion, AchievementRecord } from '@/types/state';

/**
 * 同步接口定义
 */
export interface SyncInterface {
  /**
   * 读取任务列表
   */
  loadTasks(): Promise<Task[]>;

  /**
   * 保存任务列表
   */
  saveTasks(tasks: Task[]): Promise<void>;

  /**
   * 读取任务完成记录
   */
  loadCompletions(): Promise<TaskCompletion[]>;

  /**
   * 保存任务完成记录
   */
  saveCompletions(completions: TaskCompletion[]): Promise<void>;

  /**
   * 读取成就记录
   */
  loadAchievements(): Promise<AchievementRecord[]>;

  /**
   * 保存成就记录
   */
  saveAchievements(achievements: AchievementRecord[]): Promise<void>;

  /**
   * 清除所有数据
   */
  clear(): Promise<void>;


  export(): Promise<{ tasks: Task[], completions: TaskCompletion[], achievements: AchievementRecord[] }>;
  import(data: { tasks: Task[], completions: TaskCompletion[], achievements: AchievementRecord[] }): Promise<void>;
}
