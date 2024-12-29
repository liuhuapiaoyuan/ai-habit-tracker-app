'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from 'framer-motion';
import { useAppState } from '@/store/AppContext';
import Navigation from '@/components/Navigation';
import TaskCard from '@/components/TaskCard';
import TaskEditModal from '@/components/TaskEditModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import MarketModal from '@/components/MarketModal';
import { habitMarket } from '@/config/market';
import type { Task } from '@/types/task';

export default function ManageTasks() {
  const { state, addTasks,updateTask,deleteTask } = useAppState();
  const { tasks } = state;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    type: 'daily',
    days: [],
    reward: 3,
    icon: '📝'
  });

  const handleCreateTask = useCallback((task: Task) => {
  
    addTasks([{
      ...task,
      id: uuidv4(),
      progress: 0,
      completedDates: []
    }]);
    setShowCreateForm(false);
  }, [addTasks]);

  const handleDeleteTask = useCallback((id: string) => {
    deleteTask(id);
    setTaskToDelete(null);
  }, [deleteTask]);

  const handleEditTask = useCallback((updatedTask: Task) => {
    updateTask(updatedTask.id, updatedTask);
    setTaskToEdit(null);
  }, [updateTask]);

  const handleImportFromMarket = useCallback((product: any) => {
    const tasksToAdd = product.tasks.map((task: Partial<Task>) => ({
      ...task,
      id: uuidv4(),
      progress: 0,
      completedDates: []
    }));
    addTasks(tasksToAdd)
    setShowMarketModal(false);
  }, [addTasks]);

  return (
    <div className="">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            管理任务
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowMarketModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              任务市场
            </button>
            <button
              onClick={() => {
                setNewTask({
                  title: '',
                  description: '',
                  type: 'daily',
                  days: [],
                  reward: 3,
                  icon: '📝'
                });
                setShowCreateForm(true);
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              创建任务
            </button>
          </div>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setTaskToEdit}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>
        </AnimatePresence>

        {showCreateForm && (
          <TaskEditModal
            task={newTask}
            onSave={handleCreateTask}
            onClose={() => setShowCreateForm(false)}
          />
        )}

        {taskToEdit && (
          <TaskEditModal
            task={taskToEdit}
            onSave={handleEditTask}
            onClose={() => setTaskToEdit(null)}
          />
        )}

        {taskToDelete && (
          <ConfirmationModal
            message="确定要删除这个任务吗？这个操作不能撤销。"
            onConfirm={() => handleDeleteTask(taskToDelete.id)}
            onCancel={() => setTaskToDelete(null)}
          />
        )}

        {showMarketModal && (
          <MarketModal
            market={habitMarket}
            onSelect={handleImportFromMarket}
            onClose={() => setShowMarketModal(false)}
          />
        )}
      </main>
    </div>
  );
}
