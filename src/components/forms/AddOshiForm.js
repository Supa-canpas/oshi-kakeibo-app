import React, { useState } from 'react';

const AddOshiForm = ({
  oshiList,
  setOshiList,
  setShowAddOshi,
  colors,
  genres
}) => {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    color: colors[0],
    icon: '⭐',
    birthday: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted with data:', formData);
    
    if (formData.name && formData.genre) {
      const newOshi = {
        id: Date.now(),
        ...formData
      };
      console.log('Adding new oshi:', newOshi);
      
      setOshiList([...oshiList, newOshi]);
      setShowAddOshi(false);
      setFormData({
        name: '',
        genre: '',
        color: colors[0],
        icon: '⭐',
        birthday: ''
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

  const iconOptions = ['⭐', '🎭', '🎤', '🚀', '🌟', '💎', '🎨', '🎪', '🎸', '🎬'];

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
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map(icon => (
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">イメージカラー</label>
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">誕生日</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
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
    </div>
  );
};

export default AddOshiForm;