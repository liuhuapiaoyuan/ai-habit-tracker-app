'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Task } from '@/types/task';

interface MarketItem {
  id: string;
  name: string;
  tasks: Partial<Task>[];
}

interface Props {
  market: MarketItem[];
  onSelect: (item: MarketItem) => void;
  onClose: () => void;
}

export default function MarketModal({ market, onSelect, onClose }: Props) {
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  const handleSelect = (item: MarketItem) => {
    setSelectedItem(item);
  };

  const handleCancel = () => {
    setSelectedItem(null);
    onClose();
  };

  const handleImport = () => {
    if (selectedItem) {
      onSelect(selectedItem);
    }
    onClose();
  };

  return (
    <Modal onClose={handleCancel}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">习惯市场</h2>
        <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto">
          {market.map(item => (
            <div
              key={item.id}
              className={`p-4 bg-gray-50 dark:bg-black/50 rounded-lg  transition-colors cursor-pointer 
                          ${selectedItem?.id === item.id ? 'bg-primary dark:bg-primary-50 text-white' : ''}`}
              onClick={() => handleSelect(item)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-2xl 
                             bg-white dark:bg-gray-800 rounded-lg">
                  {item.tasks[0]?.icon || '📚'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tasks.map((task, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-800 
                                 rounded-full text-gray-600 dark:text-gray-400"
                      >
                        {task.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-opacity-90"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            className={`px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-opacity-90 ${!selectedItem ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            导入
          </button>
        </div>
      </div>
    </Modal>
  );
}
