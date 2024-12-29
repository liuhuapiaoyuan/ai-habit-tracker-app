'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import Modal from './Modal';

interface Props {
  task: Partial<Task>;
  onSave: (task: Task) => void;
  onClose: () => void;
}

export default function TaskEditModal({ task, onSave, onClose }: Props) {
  const [formData, setFormData] = useState(task);
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const icons = ['📝', '📚', '💪', '🎯', '🎨', '🎵', '🏃‍♂️', '🧘‍♂️', '🥗', '💡', '✍️', '📖'];

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Task);
  };

  const toggleDay = (day: number) => {
    const days = formData.days || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    setFormData({ ...formData, days: newDays });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">
          {task.id ? '编辑任务' : '创建新任务'}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            任务名称
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:border-gray-700 
                     dark:bg-gray-800 focus:outline-none focus:ring-2 
                     focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            任务描述
          </label>
          <textarea
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:border-gray-700 
                     dark:bg-gray-800 focus:outline-none focus:ring-2 
                     focus:ring-primary"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            任务类型
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.type === 'daily'}
                onChange={() => setFormData({ ...formData, type: 'daily', days: [] })}
                className="form-radio text-primary"
              />
              <span className="ml-2">每日任务</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.type === 'weekly'}
                onChange={() => setFormData({ ...formData, type: 'weekly', days: [] })}
                className="form-radio text-primary"
              />
              <span className="ml-2">每周任务</span>
            </label>
          </div>
        </div>

        {formData.type === 'weekly' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              重复日期
            </label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.days?.includes(index)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            任务图标
          </label>
          <div className="grid grid-cols-6 gap-2">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`p-2 text-2xl rounded-lg ${
                  formData.icon === icon
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            奖励点数
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.reward || 3}
            onChange={e => setFormData({ ...formData, reward: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>简单 (1点)</span>
            <span>中等 (3点)</span>
            <span>困难 (5点)</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded-md"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            保存
          </button>
        </div>
      </form>
    </Modal>
  );
}
