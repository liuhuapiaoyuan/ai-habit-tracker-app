'use client';

import Modal from './Modal';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ message, onConfirm, onCancel }: Props) {
  return (
    <Modal onClose={onCancel}>
      <div className="text-center">
        <svg
          className="mx-auto mb-4 w-12 h-12 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          {message}
        </h3>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 
                     focus:ring-red-300 font-medium rounded-lg text-sm 
                     inline-flex items-center px-5 py-2.5 text-center"
          >
            确认删除
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 
                     focus:ring-gray-200 rounded-lg border border-gray-200 
                     text-sm font-medium px-5 py-2.5 hover:text-gray-900 
                     focus:z-10 dark:bg-gray-700 dark:text-gray-300 
                     dark:border-gray-500 dark:hover:text-white 
                     dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            取消
          </button>
        </div>
      </div>
    </Modal>
  );
}
