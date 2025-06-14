import React from 'react';
import { BarChart3 } from 'lucide-react';

const AnalyticsScreen = ({
  expenses,
  oshiList,
  getTotalExpensesByOshi,
  expenseCategories
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // 月別データ（過去6ヶ月）
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === targetDate.getMonth() && 
             expDate.getFullYear() === targetDate.getFullYear();
    });
    
    monthlyData.push({
      month: targetDate.toLocaleDateString('ja-JP', { month: 'short' }),
      amount: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    });
  }

  // 推し別データ
  const oshiData = oshiList.map(oshi => ({
    name: oshi.name,
    amount: getTotalExpensesByOshi(oshi.id, 'month'),
    color: oshi.color,
    icon: oshi.icon
  })).filter(item => item.amount > 0);

  // カテゴリ別データ
  const categoryData = expenseCategories.map(category => {
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return exp.category === category &&
             expDate.getMonth() === currentMonth &&
             expDate.getFullYear() === currentYear;
    });
    
    const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total };
  }).filter(item => item.total > 0);

  const totalThisMonth = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* 月次サマリー */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">分析・レポート</h2>
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="text-3xl font-bold mb-2">¥{totalThisMonth.toLocaleString()}</div>
        <p className="text-blue-100">今月の総支出</p>
      </div>

      {/* 推し別支出 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">推し別支出（今月）</h2>
        <div className="space-y-4">
          {oshiData.map(item => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">¥{item.amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  {totalThisMonth > 0 ? Math.round((item.amount / totalThisMonth) * 100) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* カテゴリ別支出 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">カテゴリ別支出（今月）</h2>
        <div className="space-y-4">
          {categoryData.map(item => (
            <div key={item.category} className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{item.category}</span>
              <div className="text-right">
                <div className="font-bold text-gray-800">¥{item.total.toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  {totalThisMonth > 0 ? Math.round((item.total / totalThisMonth) * 100) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 月次推移 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">月次推移</h2>
        <div className="space-y-3">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{item.month}</span>
              <span className="font-bold text-gray-800">¥{item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">統計情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">
              {expenses.length}
            </div>
            <div className="text-sm text-gray-600">総取引数</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {expenses.length > 0 ? Math.round(expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length) : 0}
            </div>
            <div className="text-sm text-gray-600">平均支出額</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;