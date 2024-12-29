'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Task } from '@/types/task';
import type { TaskCompletion } from '@/hooks/useTaskCompletions';
import { Achievement, AchievementRecord } from '@/types/state';

interface Props {
  achievement: Achievement;
  achievementRecord?: AchievementRecord;
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  completions: TaskCompletion[];
}

export default function AchievementModal({ 
  achievement, 
  achievementRecord, 
  isOpen, 
  onClose, 
  tasks,
  completions 
}: Props) {
  // 根据完成记录ID获取相关任务
  const relatedCompletions = achievementRecord
    ? completions.filter(completion => 
        achievementRecord.completionId === completion.id
      )
    : [];

  const relatedTasks = relatedCompletions
    .map(completion => tasks.find(task => task.id === completion.taskId))
    .filter((task): task is Task => task !== undefined);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-4xl mr-3">{achievement.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {achievement.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {achievement.description}
            </p>

            {achievementRecord && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                获得时间：{format(new Date(achievementRecord.completedTime), 'PPP HH:mm', { locale: zhCN })}
              </div>
            )}

            {relatedTasks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  相关任务：
                </h4>
                <div className="space-y-2">
                  {relatedTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{task.icon || '📝'}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {task.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(
                          new Date(relatedCompletions[index].completedAt),
                          'HH:mm',
                          { locale: zhCN }
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
