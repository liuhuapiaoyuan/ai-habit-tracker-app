'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import TaskList from '@/components/TaskList';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
import { useAchievement } from '@/hooks/useAchievement';
import AchievementNotification from '@/components/AchievementNotification';
import { useTasks } from '@/hooks/useTasks';

export default function TodayTasks() {
  const { completeTask, uncompleteTask, isTaskCompletedToday } = useTaskCompletion();
  const { newAchievement, clearNewAchievement } = useAchievement();
  const { todayTasks, getTodayMessage,timeIcon } = useTasks();
  const [shakeTaskId, setShakeTaskId] = useState<string | null>(null);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const completedTasks = todayTasks.filter(task => isTaskCompletedToday(task.id)).length;
    setCompletionRate(todayTasks.length > 0 ? completedTasks / todayTasks.length : 0);
  }, [todayTasks, isTaskCompletedToday]);

  const getTimeIcon = () => {
    const baseSize = 24;
    const maxSize = 36;
    const size = baseSize + (maxSize - baseSize) * completionRate;
    const isCompleted = completionRate === 1;

    return (
      <span 
        className={`inline-block transition-all duration-300 ${isCompleted ? 'animate-pulse text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}
        style={{ fontSize: `${size}px` }}
      >
        {timeIcon}
      </span>
    );
  };

  if (todayTasks.length === 0) {
    return (
      <div >
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">今日待办</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-cartoon">
              <p className="text-gray-500 dark:text-gray-400">今天还没有任务哦～</p>
              <div className="mt-4">
                <a
                  href="/manage"
                  className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  去添加任务
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCompleteTask = async (id: string) => {
    completeTask(id);
    setShakeTaskId(id);
    setTimeout(() => setShakeTaskId(null), 500);
  };

  const handleUncompleteTask = (id: string) => {
    uncompleteTask(id);
  };

  return (
    <div >
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            今日任务 {getTimeIcon()}
          </h1>
          <div 
            className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 
                     px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all
                     transform hover:scale-102"
          >
            {getTodayMessage()}
          </div>
        </div>

        <TaskList
          isTaskCompletedToday={isTaskCompletedToday}
          tasks={todayTasks}
          onComplete={handleCompleteTask}
          onUncomplete={handleUncompleteTask}
          shakeTaskId={shakeTaskId}
        />

        {newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={clearNewAchievement}
          />
        )}
      </main>
    </div>
  );
}
