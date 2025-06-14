import React, { useState } from 'react';
import IconSelector from './IconSelector';
import ColorSelector from './ColorSelector';

const AddOshiForm = ({
  oshiList,
  setOshiList,
  setShowAddOshi,
  colors,
  icons,
  genres
}) => {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    color: colors[0],
    icon: icons[0],
    birthdayMonth: '',
    birthdayDay: ''
  });

  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted with data:', formData);
    
    if (formData.name && formData.genre) {
      const birthday = formData.birthdayMonth && formData.birthdayDay 
        ? `${formData.birthdayMonth.padStart(2, '0')}-${formData.birthdayDay.padStart(2, '0')}`
        : '';
      const newOshi = {
        id: Date.now(),
        name: formData.name,
        genre: formData.genre,
        color: formData.color,
        icon: formData.icon,
        birthday: birthday
      };
      console.log('Adding new oshi:', newOshi);
      
      setOshiList([...oshiList, newOshi]);
      setShowAddOshi(false);
      setFormData({
        name: '',
        genre: '',
        color: colors[0],
        icon: icons[0],
        birthdayMonth: '',
        birthdayDay: ''
      });
    } else {
      console.log('Validation failed:', { name: formData.name, genre: formData.genre });
      alert('推しの名前とジャンルを入力してください');
    }
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add button clicked');
    handleSubmit(e);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">推しを追加</h2>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAddOshi(false);
            }} 
            className="text-gray-500 hover:text-gray-700 p-1 z-10 relative cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">推しの名前</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="推しの名前を入力"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ジャンル</label>
              <select 
                value={formData.genre} 
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">ジャンルを選択</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">アイコン</label>
              <div className="relative">
                <div className="grid grid-cols-5 gap-2">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({...formData, icon})}
                      className={`p-3 text-2xl rounded-lg border-2 ${
                        formData.icon === icon 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {/* <button
                  type="button"
                  onClick={() => setShowIconSelector(true)}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-pink-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-pink-600"
                >
                  +
                </button> */}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">イメージカラー</label>
              <div className="relative">
                <div className="grid grid-cols-4 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-full h-12 rounded-lg border-4 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {/* <button
                  type="button"
                  onClick={() => setShowColorSelector(true)}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-pink-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-pink-600"
                >
                  +
                </button> */}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">誕生日</label>
              <div className="flex gap-2">
                <select
                  value={formData.birthdayMonth}
                  onChange={(e) => setFormData({...formData, birthdayMonth: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">月</option>
                  {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{month}月</option>
                  ))}
                </select>
                <select
                  value={formData.birthdayDay}
                  onChange={(e) => setFormData({...formData, birthdayDay: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">日</option>
                  {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}日</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAddOshi(false);
                }}
                className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 z-10 relative cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleAddClick}
                className="flex-1 p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 z-10 relative cursor-pointer"
              >
                追加
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* アイコン選択モーダル */}
      {showIconSelector && (
        <IconSelector
          currentIcon={formData.icon}
          availableIcons={icons}
          onIconChange={(newIcon) => setFormData({...formData, icon: newIcon})}
          onClose={() => setShowIconSelector(false)}
        />
      )}
      
      {/* カラー選択モーダル */}
      {showColorSelector && (
        <ColorSelector
          currentColor={formData.color}
          availableColors={colors}
          onColorChange={(newColor) => setFormData({...formData, color: newColor})}
          onClose={() => setShowColorSelector(false)}
        />
      )}
    </div>
  );
};

export default AddOshiForm;