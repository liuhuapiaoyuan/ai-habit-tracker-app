import React from 'react'
import { createPortal } from 'react-dom'

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">确认删除</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-opacity-90"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmationModal
