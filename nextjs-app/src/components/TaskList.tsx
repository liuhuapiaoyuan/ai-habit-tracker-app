'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';

interface Props {
  tasks: Task[];
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  isTaskCompletedToday: (id: string) => boolean;
  shakeTaskId: string | null;
}

export default function TaskList({ tasks, onComplete, onUncomplete, isTaskCompletedToday: isTaskCompletedTodayFn, shakeTaskId }: Props) {

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {tasks.map((task) => {
          const isTaskCompletedToday = isTaskCompletedTodayFn(task.id);
          return (
            
          <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isTaskCompletedToday ? {
            opacity: 1,
            y: 0,
            scale: [1, 1.05, 0.95, 1.05, 0.95, 1],
            x: [0, -15, 15, -15, 15, -8, 8, 0],
          } : shakeTaskId === task.id ? {
            opacity: 1,
            y: 0,
            rotate: [0, -5, 5, -3, 3, 0]
          } : {
            opacity: 1,
            y: 0
          }}
          transition={shakeTaskId === task.id ? {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
          } : {
            duration: 0.8,
            ease: "easeInOut",
            times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1]
          }}
          exit={{ opacity: 0, y: -20 }}
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] 
            ${isTaskCompletedToday ? 'shadow-success animate-glow' : 'shadow-cartoon'}`}
          onClick={() => isTaskCompletedToday ? onUncomplete(task.id) : onComplete(task.id)}
        >
          <div className="flex items-center gap-4">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                ${isTaskCompletedToday ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              {task.icon || '📝'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className={`
                  text-sm px-2 py-0.5 rounded-full
                  ${task.reward >= 4 ? 'bg-purple-100 text-purple-700' :
                    task.reward >= 3 ? 'bg-blue-100 text-blue-700' :
                    task.reward >= 2 ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'}
                `}>
                  {task.reward} 点奖励
                </div>
                {task.type === 'weekly' && (
                  <div className="text-sm bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    每周任务
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(isTaskCompletedToday){
                  onUncomplete(task.id)
                }else{
                  onComplete(task.id) 
                }
              }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform 
                ${isTaskCompletedToday ? 'bg-green-500 text-white scale-110' : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              {isTaskCompletedToday ? '✓' : '○'}
            </button>
          </div>
        </motion.div>
      
          )
        })}
      </AnimatePresence>
    </div>
  );
}
