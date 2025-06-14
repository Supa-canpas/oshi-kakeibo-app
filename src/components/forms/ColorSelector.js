import React, { useState } from 'react';

const ColorSelector = ({
  currentColor,
  availableColors,
  onColorChange,
  onClose
}) => {
  const [tempColor, setTempColor] = useState(currentColor);
  const [newColorInput, setNewColorInput] = useState('#ff69b4');

  const handleConfirm = () => {
    onColorChange(tempColor);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleAddNewColor = () => {
    if (newColorInput && !availableColors.includes(newColorInput)) {
      availableColors.push(newColorInput);
      setTempColor(newColorInput);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-800 mb-4">カラーを選択</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">変更前</div>
            <div className="text-sm text-gray-600">変更後</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div 
              className="w-16 h-16 rounded-lg border-2 border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
            <div className="text-gray-400">→</div>
            <div 
              className="w-16 h-16 rounded-lg border-2 border-gray-300"
              style={{ backgroundColor: tempColor }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {availableColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setTempColor(color)}
              className={`w-full h-12 rounded-lg border-4 ${
                tempColor === color ? 'border-gray-800' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="color"
              value={newColorInput}
              onChange={(e) => setNewColorInput(e.target.value)}
              className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={handleAddNewColor}
              className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              追加
            </button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600"
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;