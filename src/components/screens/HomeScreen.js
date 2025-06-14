import React from 'react';
import { Plus, TrendingUp, AlertTriangle, Edit, Trash2 } from 'lucide-react';

const HomeScreen = ({
  expenses,
  oshiList,
  budgets,
  notifications,
  setSelectedOshi,
  setCurrentScreen,
  setShowAddOshi,
  editExpense,
  deleteExpense,
  setSelectedPhoto,
  setShowPhotoViewer,
  getTotalExpensesByOshi,
  getTotalBudgetUsageByOshi
}) => {
  const totalMonthlyExpenses = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* 通知エリア */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                notification.type === 'over' 
                  ? 'bg-red-50 border border-red-200' 
                  : notification.type === 'birthday'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 ${
                notification.type === 'over' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'over' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 今月の支出サマリー */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">今月の推し活</h2>
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="text-3xl font-bold mb-2">¥{totalMonthlyExpenses.toLocaleString()}</div>
        <p className="text-pink-100">今月の合計支出</p>
      </div>

      {/* 推し一覧 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">推し一覧</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAddOshi(true);
            }}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 z-10 relative"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {oshiList.map(oshi => {
            const monthlyTotal = getTotalExpensesByOshi(oshi.id, 'month');
            const allTimeTotal = getTotalExpensesByOshi(oshi.id);
            const budgetUsage = getTotalBudgetUsageByOshi(oshi.id);
            
            return (
              <div 
                key={oshi.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedOshi(oshi);
                  setCurrentScreen('oshi-detail');
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: oshi.color }}
                  >
                    {oshi.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{oshi.name}</h3>
                    <p className="text-sm text-gray-600">{oshi.genre}</p>
                    
                    {/* 予算使用率表示 */}
                    {budgetUsage.totalBudget > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">予算使用率</span>
                          <span className={`font-bold ${
                            budgetUsage.percentage >= 100 ? 'text-red-600' :
                            budgetUsage.percentage >= 80 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {Math.round(budgetUsage.percentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              budgetUsage.percentage >= 100 ? 'bg-red-500' :
                              budgetUsage.percentage >= 80 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(budgetUsage.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ¥{budgetUsage.totalSpent.toLocaleString()} / ¥{budgetUsage.totalBudget.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">¥{monthlyTotal.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">今月 / 総計¥{allTimeTotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近の支出 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">最近の支出</h2>
        <div className="space-y-3">
          {expenses.slice(0, 5).map(expense => {
            const oshi = oshiList.find(o => o.id === expense.oshiId);
            return (
              <div key={expense.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: oshi?.color }}
                    >
                      {oshi?.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{expense.category}</div>
                      <div className="text-sm text-gray-600">{oshi?.name} • {expense.note}</div>
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
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <div className="font-bold text-gray-800">¥{expense.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{expense.date}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          editExpense(expense);
                        }}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded z-10 relative"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteExpense(expense.id);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded z-10 relative"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;