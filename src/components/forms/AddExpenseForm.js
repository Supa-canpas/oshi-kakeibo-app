import React, { useState } from 'react';

const AddExpenseForm = ({
  expenses,
  setExpenses,
  oshiList,
  expenseCategories,
  setShowAddExpense,
  setShowCamera,
  setSelectedPhoto,
  setShowPhotoViewer
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    oshiId: '',
    note: '',
    photo: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Expense form submitted with data:', formData);
    
    if (formData.amount && formData.category && formData.oshiId) {
      const newExpense = {
        id: Date.now(),
        amount: parseInt(formData.amount),
        date: formData.date,
        category: formData.category,
        oshiId: parseInt(formData.oshiId),
        note: formData.note,
        photo: formData.photo
      };
      console.log('Adding new expense:', newExpense);
      
      setExpenses([...expenses, newExpense]);
      setShowAddExpense(false);
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        oshiId: '',
        note: '',
        photo: null
      });
    } else {
      console.log('Expense validation failed:', formData);
      alert('金額、カテゴリ、推しを入力してください');
    }
  };

  const handleAddExpenseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add expense button clicked');
    handleSubmit(e);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({...formData, photo: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
    setShowAddExpense(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">支出を追加</h2>
          <button onClick={() => setShowAddExpense(false)} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">推し</label>
            <select 
              value={formData.oshiId} 
              onChange={(e) => setFormData({...formData, oshiId: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">推しを選択</option>
              {oshiList.map(oshi => (
                <option key={oshi.id} value={oshi.id}>{oshi.icon} {oshi.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="金額を入力"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">カテゴリを選択</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="メモ（任意）"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">写真</label>
            <div className="flex gap-2">
              <label className="flex-1 p-3 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                📁 ファイル選択
              </label>
              <button
                type="button"
                onClick={handleCameraCapture}
                className="flex-1 p-3 border border-gray-300 rounded-lg text-center hover:bg-gray-50"
              >
                📷 カメラ
              </button>
            </div>
            {formData.photo && (
              <div className="mt-2 relative">
                <img 
                  src={formData.photo} 
                  alt="レシート" 
                  className="w-full h-32 object-cover rounded-lg"
                  onClick={() => {
                    setSelectedPhoto(formData.photo);
                    setShowPhotoViewer(true);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, photo: null})}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddExpense(false);
              }}
              className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 z-10 relative cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleAddExpenseClick}
              className="flex-1 p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 z-10 relative cursor-pointer"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;