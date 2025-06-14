import React, { useState } from 'react';

const EditExpenseForm = ({
  expenses,
  setExpenses,
  oshiList,
  expenseCategories,
  setShowEditExpense,
  editingExpense,
  setEditingExpense
}) => {
  const [formData, setFormData] = useState({
    amount: editingExpense?.amount?.toString() || '',
    date: editingExpense?.date || '',
    category: editingExpense?.category || '',
    oshiId: editingExpense?.oshiId?.toString() || '',
    note: editingExpense?.note || '',
    photo: editingExpense?.photo || null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.oshiId) {
      const updatedExpense = {
        ...editingExpense,
        amount: parseInt(formData.amount),
        date: formData.date,
        category: formData.category,
        oshiId: parseInt(formData.oshiId),
        note: formData.note,
        photo: formData.photo
      };
      
      setExpenses(expenses.map(exp => 
        exp.id === editingExpense.id ? updatedExpense : exp
      ));
      setShowEditExpense(false);
      setEditingExpense(null);
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">支出を編集</h2>
          <button onClick={() => {setShowEditExpense(false); setEditingExpense(null);}} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="w-full p-3 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              📁 写真を変更
            </label>
            {formData.photo && (
              <div className="mt-2 relative">
                <img 
                  src={formData.photo} 
                  alt="レシート" 
                  className="w-full h-32 object-cover rounded-lg"
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
                setShowEditExpense(false);
                setEditingExpense(null);
              }}
              className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 z-10 relative"
            >
              キャンセル
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex-1 p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 z-10 relative"
            >
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseForm;