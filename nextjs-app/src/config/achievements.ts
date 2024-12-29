import { parseISO } from 'date-fns'
import type { Task } from '@/types/task'
import type { TaskCompletion } from '@/hooks/useTaskCompletions'

// 辅助函数：检查连续天数
const checkConsecutiveDays = (dates: string[], requiredDays: number) => {
  if (!dates.length) return false
  
  // 按日期排序
  const sortedDates = [...new Set(dates.map(d => d.split('T')[0]))].sort()
  
  // 从最新日期开始往前检查
  let consecutiveDays = 1
  for (let i = sortedDates.length - 1; i > 0; i--) {
    const current = parseISO(sortedDates[i])
    const previous = parseISO(sortedDates[i - 1])
    
    // 如果日期相差1天，增加连续天数
    if (Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)) === 1) {
      consecutiveDays++
      if (consecutiveDays >= requiredDays) return true
    } else {
      // 连续中断，重新计数
      consecutiveDays = 1
    }
  }
  
  return consecutiveDays >= requiredDays
}

// 辅助函数：检查时间段内的任务数
const checkTasksInTimeRange = (dates: string[], startHour: number, endHour: number) => {
  return dates.some(date => {
    const hour = parseISO(date).getHours()
    return hour >= startHour && hour < endHour
  })
}

export const achievements = [
  {
    id: 1,
    title: '初出茅庐',
    description: '完成第一个任务',
    icon: '🏅',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      return completions.length === 1;
    }
  },
  {
    id: 2,
    title: '坚持不懈',
    description: '连续7天完成任务',
    icon: '🔥',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      return checkConsecutiveDays(completions.map(c => c.completedAt), 7);
    }
  },
  {
    id: 3,
    title: '任务大师',
    description: '完成100个任务',
    icon: '👑',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      return completions.length >= 100;
    }
  },
  {
    id: 4,
    title: '早起鸟儿',
    description: '在早上6点前完成任务',
    icon: '🌅',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      return completions.some(c => parseISO(c.completedAt).getHours() < 6);
    }
  },
  {
    id: 5,
    title: '周末战士',
    description: '在周末完成10个任务',
    icon: '🎯',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const weekendCompletions = completions.filter(c => {
        const day = parseISO(c.completedAt).getDay();
        return day === 0 || day === 6;
      });
      return weekendCompletions.length >= 10;
    }
  },
  {
    id: 6,
    title: '健康先锋',
    description: '完成50个健康相关任务',
    icon: '💪',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const healthCompletions = completions.filter(c => {
        const task = tasks.find(t => t.id === c.taskId);
        return task && (task.title.includes('健康') || task.title.includes('运动'));
      });
      return healthCompletions.length >= 50;
    }
  },
  {
    id: 7,
    title: '学习达人',
    description: '完成30个学习相关任务',
    icon: '📚',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const studyCompletions = completions.filter(c => {
        const task = tasks.find(t => t.id === c.taskId);
        return task && (task.title.includes('学习') || task.title.includes('阅读'));
      });
      return studyCompletions.length >= 30;
    }
  },
  {
    id: 8,
    title: '效率专家',
    description: '在一天内完成5个任务',
    icon: '⏱️',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const dateCompletionsMap = completions.reduce((map, completion) => {
        const day = completion.completedAt.split('T')[0];
        if (!map[day]) map[day] = [];
        map[day].push(completion);
        return map;
      }, {} as Record<string, TaskCompletion[]>);
      return Object.values(dateCompletionsMap).some(completions => completions.length >= 5);
    }
  },
  {
    id: 9,
    title: '早起冠军',
    description: '连续30天在早上7点前完成任务',
    icon: '🌞',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const earlyCompletions = completions.filter(c => parseISO(c.completedAt).getHours() < 7);
      return checkConsecutiveDays(earlyCompletions.map(c => c.completedAt), 30);
    }
  },
  {
    id: 10,
    title: '习惯养成者',
    description: '坚持使用应用30天',
    icon: '📅',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const completionDates = completions.map(c => c.completedAt.split('T')[0]);
      return new Set(completionDates).size >= 30;
    }
  },
  {
    id: 11,
    title: '任务收集者',
    description: '创建50个不同任务',
    icon: '📋',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      return tasks.length >= 50;
    }
  },
  {
    id: 12,
    title: '完美主义者',
    description: '连续7天完成所有任务',
    icon: '🌟',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      if (tasks.length === 0) return false;
      
      // 获取所有任务的完成日期
      const dateTasksMap = completions.reduce((map, completion) => {
        const day = completion.completedAt.split('T')[0];
        if (!map[day]) map[day] = new Set();
        map[day].add(completion.taskId);
        return map;
      }, {} as Record<string, Set<string>>);

      // 按日期排序
      const sortedDates = Object.keys(dateTasksMap).sort();
      if (sortedDates.length < 7) return false;

      // 检查最近7天是否每天都完成了所有任务
      let consecutiveDays = 0;
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const date = sortedDates[i];
        const completedTasks = dateTasksMap[date];
        
        // 检查这一天是否完成了所有任务
        const allTasksCompleted = tasks.every(task => completedTasks.has(task.id));
        
        if (allTasksCompleted) {
          consecutiveDays++;
          if (consecutiveDays >= 7) return true;
        } else {
          consecutiveDays = 0;
        }
      }
      
      return false;
    }
  },
  {
    id: 13,
    title: '早起挑战者',
    description: '连续7天在早上6点前完成任务',
    icon: '⏰',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const earlyCompletions = completions.filter(c => parseISO(c.completedAt).getHours() < 6);
      return checkConsecutiveDays(earlyCompletions.map(c => c.completedAt), 7);
    }
  },
  {
    id: 14,
    title: '周末达人',
    description: '在周末完成20个任务',
    icon: '🎊',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const weekendCompletions = completions.filter(c => {
        const day = parseISO(c.completedAt).getDay();
        return day === 0 || day === 6;
      });
      return weekendCompletions.length >= 20;
    }
  },
  {
    id: 15,
    title: '健康生活家',
    description: '完成100个健康相关任务',
    icon: '🥗',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const healthCompletions = completions.filter(c => {
        const task = tasks.find(t => t.id === c.taskId);
        return task && (task.title.includes('健康') || task.title.includes('运动'));
      });
      return healthCompletions.length >= 100;
    }
  },
  {
    id: 16,
    title: '终身学习者',
    description: '完成100个学习相关任务',
    icon: '🎓',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const studyCompletions = completions.filter(c => {
        const task = tasks.find(t => t.id === c.taskId);
        return task && (task.title.includes('学习') || task.title.includes('阅读'));
      });
      return studyCompletions.length >= 100;
    }
  },
  {
    id: 17,
    title: '效率大师',
    description: '在一天内完成10个任务',
    icon: '🚀',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const dateCompletionsMap = completions.reduce((map, completion) => {
        const day = completion.completedAt.split('T')[0];
        if (!map[day]) map[day] = [];
        map[day].push(completion);
        return map;
      }, {} as Record<string, TaskCompletion[]>);
      return Object.values(dateCompletionsMap).some(completions => completions.length >= 10);
    }
  },
  {
    id: 18,
    title: '早起王者',
    description: '连续100天在早上7点前完成任务',
    icon: '👑',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const earlyCompletions = completions.filter(c => parseISO(c.completedAt).getHours() < 7);
      return checkConsecutiveDays(earlyCompletions.map(c => c.completedAt), 100);
    }
  },
  {
    id: 19,
    title: '习惯大师',
    description: '坚持使用应用100天',
    icon: '📆',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      const completionDates = completions.map(c => c.completedAt.split('T')[0]);
      return new Set(completionDates).size >= 100;
    }
  },
  {
    id: 20,
    title: '任务收藏家',
    description: '创建100个不同任务',
    icon: '📚',
    condition: (tasks: Task[], completions: TaskCompletion[]) => {
      return tasks.length >= 100;
    }
  }
]
