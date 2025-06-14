import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const OshiDetailScreen = ({
  selectedOshi,
  expenses,
  oshiList,
  budgets,
  getTotalExpensesByOshi,
  getBudgetUsage,
  editExpense,
  deleteExpense,
  setSelectedPhoto,
  setShowPhotoViewer,
  expenseCategories
}) => {
  if (!selectedOshi) return null;

  const oshiExpenses = expenses.filter(exp => exp.oshiId === selectedOshi.id);
  const monthlyTotal = getTotalExpensesByOshi(selectedOshi.id, 'month');
  const allTimeTotal = getTotalExpensesByOshi(selectedOshi.id);

  // カテゴリ別集計
  const categoryTotals = expenseCategories.map(category => {
    const total = oshiExpenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total };
  }).filter(item => item.total > 0);

  return (
    <div className="space-y-6">
      {/* 推しヘッダー */}
      <div 
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ backgroundColor: selectedOshi.color }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
            {selectedOshi.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{selectedOshi.name}</h1>
            <p className="opacity-90">{selectedOshi.genre}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">¥{monthlyTotal.toLocaleString()}</div>
            <div className="text-sm opacity-90">今月の支出</div>
          </div>
          <div>
            <div className="text-2xl font-bold">¥{allTimeTotal.toLocaleString()}</div>
            <div className="text-sm opacity-90">総支出</div>
          </div>
        </div>
      </div>

      {/* 予算状況 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">予算状況</h2>
        <div className="space-y-4">
          {expenseCategories.map(category => {
            const usage = getBudgetUsage(selectedOshi.id, category);
            if (usage.budget === 0) return null;
            
            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-600">
                    ¥{usage.spent.toLocaleString()} / ¥{usage.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      usage.percentage >= 100 ? 'bg-red-500' : 
                      usage.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(usage.percentage)}% 使用
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* カテゴリ別支出 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">カテゴリ別支出</h2>
        <div className="space-y-3">
          {categoryTotals.map(item => (
            <div key={item.category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{item.category}</span>
              <span className="font-bold text-gray-800">¥{item.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 支出履歴 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">支出履歴</h2>
        <div className="space-y-3">
          {oshiExpenses.slice(0, 10).map(expense => (
            <div key={expense.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-800">{expense.category}</div>
                  <div className="text-sm text-gray-600">{expense.note}</div>
                  <div className="text-xs text-gray-500">{expense.date}</div>
                </div>
                {expense.photo && (
                  <img 
                    src={expense.photo} 
                    alt="レシート" 
                    className="w-8 h-8 object-cover rounded cursor-pointer"
                    onClick={() => {
                      setSelectedPhoto(expense.photo);
                      setShowPhotoViewer(true);
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-gray-800">¥{expense.amount.toLocaleString()}</div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editExpense(expense);
                    }}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded z-10 relative"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteExpense(expense.id);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded z-10 relative"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OshiDetailScreen;