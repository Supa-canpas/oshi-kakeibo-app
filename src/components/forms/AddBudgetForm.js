import React, { useState } from 'react';

const AddBudgetForm = ({
  budgets,
  setBudgets,
  oshiList,
  expenseCategories,
  setShowAddBudget
}) => {
  const [formData, setFormData] = useState({
    oshiId: '',
    amount: '',
    period: '毎月'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Budget form submitted with data:', formData); // デバッグ用
    
    if (formData.oshiId && formData.amount) {
      const oshiId = parseInt(formData.oshiId);
      const amount = parseInt(formData.amount);
      const period = formData.period;
      
      // 同じ推しの同じ期間の予算が既に存在するかチェック
      const existingBudgetIndex = budgets.findIndex(
        budget => budget.oshiId === oshiId && budget.period === period
      );
      
      let updatedBudgets;
      
      if (existingBudgetIndex !== -1) {
        // 既存の予算がある場合、金額を統合
        updatedBudgets = [...budgets];
        updatedBudgets[existingBudgetIndex] = {
          ...updatedBudgets[existingBudgetIndex],
          amount: updatedBudgets[existingBudgetIndex].amount + amount
        };
      } else {
        // 新しい予算を追加
        const newBudget = {
          id: Date.now(),
          oshiId: oshiId,
          amount: amount,
          period: period,
          createdAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString()
        };
        updatedBudgets = [...budgets, newBudget];
      }
      
      console.log('Updated budgets:', updatedBudgets); // デバッグ用
      
      setBudgets(updatedBudgets);
      setShowAddBudget(false);
      setFormData({
        oshiId: '',
        amount: '',
        period: '毎月'
      });
    } else {
      console.log('Budget validation failed:', formData); // デバッグ用
      alert('すべての項目を入力してください');
    }
  };

  const handleAddBudgetClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add budget button clicked'); // デバッグ用
    handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">予算を追加</h2>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAddBudget(false);
            }} 
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">推し</label>
            <select 
              value={formData.oshiId} 
              onChange={(e) => setFormData({...formData, oshiId: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">推しを選択</option>
              {oshiList.map(oshi => (
                <option key={oshi.id} value={oshi.id}>{oshi.icon} {oshi.name}</option>
              ))}
            </select>
          </div>
          
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">予算金額</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="予算金額を入力"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
            <select 
              value={formData.period} 
              onChange={(e) => setFormData({...formData, period: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="毎月">毎月</option>
              <option value="臨時イベント">臨時イベント{new Date().getFullYear()}年{new Date().getMonth() + 1}月</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddBudget(false);
              }}
              className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 z-10 relative cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleAddBudgetClick}
              className="flex-1 p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 z-10 relative cursor-pointer"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetForm;