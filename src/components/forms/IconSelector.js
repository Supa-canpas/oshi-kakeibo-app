import React, { useState } from 'react';

const IconSelector = ({
  currentIcon,
  availableIcons,
  onIconChange,
  onClose
}) => {
  const [tempIcon, setTempIcon] = useState(currentIcon);
  const [newIconInput, setNewIconInput] = useState('');

  const handleConfirm = () => {
    onIconChange(tempIcon);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleAddNewIcon = () => {
    if (newIconInput.trim()) {
      const newIcon = newIconInput.trim();
      setTempIcon(newIcon);
      if (!availableIcons.includes(newIcon)) {
        availableIcons.push(newIcon);
      }
      setNewIconInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-800 mb-4">アイコンを選択</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">変更前</div>
            <div className="text-sm text-gray-600">変更後</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="text-4xl">{currentIcon}</div>
            <div className="text-gray-400">→</div>
            <div className="text-4xl">{tempIcon}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-3 mb-4">
          {availableIcons.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => setTempIcon(icon)}
              className={`p-3 text-2xl rounded-lg border-2 ${
                tempIcon === icon 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIconInput}
              onChange={(e) => setNewIconInput(e.target.value)}
              placeholder="新しいアイコンを入力"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddNewIcon}
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

export default IconSelector;