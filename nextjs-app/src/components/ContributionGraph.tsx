'use client';

import { useEffect, useState } from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { TaskCompletion } from '@/types/state';

interface Props {
  tasks: TaskCompletion[];
}

export default function ContributionGraph({ tasks }: Props) {
  const [columns, setColumns] = useState(52);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(Math.min(15, Math.floor(window.innerWidth / 16)));
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const getContributionData = () => {
    const weeks = 12;
    const today = new Date();
    const startDate = startOfWeek(addWeeks(today, -weeks + 1));
    const endDate = endOfWeek(today);
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    const data = allDates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const totalRewards = tasks.filter(task => 
        task.completedAt.startsWith(dateStr)
      ).reduce((sum, task) => sum + (task.reward || 0), 0);
      return {
        date: dateStr,
        count: totalRewards
      };
    });

    return data;
  };

  const contributionData = getContributionData();
  const maxRewards = Math.max(...contributionData.map(d => d.count));

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-foreground-800';
    const intensity = Math.min(4, Math.floor((count / maxRewards) * 4));
    return [
      'bg-green-100 dark:bg-foreground-900/30',
      'bg-green-300 dark:bg-foreground-700/50',
      'bg-green-500 dark:bg-foreground-600/70',
      'bg-green-700 dark:bg-foreground-500/80',
      'bg-green-900 dark:bg-foreground-400/90'
    ][intensity];
  };

  return (
    <div className="w-full">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {contributionData.map((day, index) => (
          <div
            key={index}
            className={`aspect-square ${getColor(day.count)} rounded-sm 
                     transition-colors duration-200 hover:opacity-80`}
            title={`${format(new Date(day.date), 'yyyy-MM-dd')} - ${day.count} 星星`}
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        过去 {Math.ceil(contributionData.length / 7)} 周的任务完成情况
      </div>
    </div>
  );
}
