export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly';
  
  days?: number[];
  reward: number;
  icon?: string;
  progress: number;
  completedDates: string[];
}
