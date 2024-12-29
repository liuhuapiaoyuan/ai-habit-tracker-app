'use client';

import { motion } from 'framer-motion';
import { Task } from '@/types/task';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-cartoon"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
          {task.icon || '📝'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className={`
              text-sm px-2 py-0.5 rounded-full
              ${task.reward >= 4 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                task.reward >= 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                task.reward >= 2 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
            `}>
              {task.reward} 点奖励
            </div>
            <div className={`
              text-sm px-2 py-0.5 rounded-full
              ${task.type === 'daily' ? 
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}
            `}>
              {task.type === 'daily' ? '每日任务' : '每周任务'}
            </div>
            {task.type === 'weekly' && task.days && task.days.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {task.days.map(day => weekDays[day]).join(', ')}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light 
                     rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                     rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
