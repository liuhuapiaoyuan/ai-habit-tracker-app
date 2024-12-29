import { Task } from './task';
export interface TaskCompletion {
  id: string;  // 唯一ID
  taskId: string;
  completedAt: string;
  reward:number
}
export interface Achievement {
  id: number;
  title: string;
  description: string;
  condition: (tasks: Task[], completions: TaskCompletion[]) => boolean;
  icon?: string;
}

export interface AchievementRecord {
  id: number;
  completedTime: string;
  completionId: string; // 关联的任务完成记录ID
}

export interface AppState {
  tasks: Task[];
  completions: TaskCompletion[];
  achievements: {
    unlocked: AchievementRecord[];
    new: Achievement | null;
  };
}

export type AppAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'UNCOMPLETE_TASK'; payload: string }  // taskId
  | { type: 'SET_COMPLETIONS'; payload: TaskCompletion[] }
  | { type: 'SET_ACHIEVEMENTS'; payload: AchievementRecord[] }
  | { type: 'SET_NEW_ACHIEVEMENT'; payload: Achievement | null }
  | { type: 'ADD_TASKS'; payload: Task[] }
  | { type: 'UPDATE_TASK'; payload: { id: string; task: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }; // taskId
  
  
