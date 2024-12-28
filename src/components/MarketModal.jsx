import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const MarketModal = ({ market, onSelect, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full mx-4 h-[90vh] flex flex-col">
        <h3 className="text-xl font-bold mb-4">从市场导入习惯</h3>
        
        <div className="overflow-y-auto flex-1">
          {market.map(product => (
            <div
              key={product.id}
              className={`p-4 rounded-lg cursor-pointer mb-2 ${
                selectedProduct?.id === product.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <h4 className="font-bold">{product.name}</h4>
              <ul className="text-sm mt-2 space-y-1">
                {product.tasks.map((task, index) => (
                  <li key={index}>• {task.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            取消
          </button>
          <button
            onClick={() => {
              if (selectedProduct) {
                onSelect(selectedProduct)
              }
              onClose()
            }}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            导入
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MarketModal
