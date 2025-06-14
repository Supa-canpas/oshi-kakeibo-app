import React, { useState } from 'react';
import { Edit, Trash2, Settings, AlertTriangle, ArrowLeft } from 'lucide-react';

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
  expenseCategories,
  updateOshi,
  deleteOshi,
  setCurrentScreen
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    genre: '',
    color: '#FF69B4',
    icon: '💖',
    birthday: ''
  });

  if (!selectedOshi) return null;

  const oshiExpenses = expenses.filter(exp => exp.oshiId === selectedOshi.id);
  const monthlyTotal = getTotalExpensesByOshi(selectedOshi.id, 'month') || 0;
  const allTimeTotal = getTotalExpensesByOshi(selectedOshi.id) || 0;

  // カテゴリ別集計
  const categoryTotals = expenseCategories.map(category => {
    const total = oshiExpenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total };
  }).filter(item => item.total > 0);

  // 円グラフ用の計算
  const totalExpenses = categoryTotals.reduce((sum, item) => sum + item.total, 0);
  const pieChartData = categoryTotals.map(item => ({
    ...item,
    percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0
  }));

  // 色の配列（カテゴリ別）
  const categoryColors = {
    'チケット代': '#FF6B6B',
    'グッズ代': '#4ECDC4',
    '遠征費': '#45B7D1',
    '配信チケット代': '#96CEB4',
    'カフェ代': '#FFEAA7',
    'その他': '#DDA0DD'
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateOshi(selectedOshi.id, editFormData);
    setShowEditForm(false);
  };

  const handleDelete = () => {
    deleteOshi(selectedOshi.id);
    setCurrentScreen('home');
  };

  const renderPieChart = () => {
    if (pieChartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>支出データがありません</p>
        </div>
      );
    }

    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="240" height="240" className="transform -rotate-90">
            {pieChartData.map((item, index) => {
              const angle = (item.percentage / 100) * 360;
              const x1 = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = centerX + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = centerY + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const result = (
                <path
                  key={index}
                  d={pathData}
                  fill={categoryColors[item.category] || '#DDA0DD'}
                  stroke="white"
                  strokeWidth="2"
                />
              );
              
              currentAngle += angle;
              return result;
            })}
          </svg>
          
          {/* 中央の総額表示 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold text-gray-800">総額</div>
            <div className="text-lg font-semibold text-gray-600">¥{(totalExpenses || 0).toLocaleString()}</div>
          </div>
        </div>
        
        {/* 凡例 */}
        <div className="ml-6 space-y-2">
          {pieChartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: categoryColors[item.category] || '#DDA0DD' }}
              />
              <div className="text-sm">
                <div className="font-medium">{item.category}</div>
                <div className="text-gray-600">¥{(item.total || 0).toLocaleString()} ({Math.round(item.percentage || 0)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 戻るボタン */}
      <button
        onClick={() => setCurrentScreen('home')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

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
        
        {/* 推し操作ボタン */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setEditFormData({
                name: selectedOshi.name,
                genre: selectedOshi.genre,
                color: selectedOshi.color,
                icon: selectedOshi.icon,
                birthday: selectedOshi.birthday || ''
              });
              setShowEditForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all"
          >
            <Settings className="w-4 h-4" />
            編集
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-80 rounded-lg text-white hover:bg-opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            削除
          </button>
        </div>
      </div>

      {/* 予算状況 */}
      {/* <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                    ¥{(usage.spent || 0).toLocaleString()} / ¥{(usage.budget || 0).toLocaleString()}
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
                  {Math.round(usage.percentage || 0)}% 使用
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* 理由別使用額円グラフ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">理由別使用額</h2>
        {renderPieChart()}
      </div>

      {/* カテゴリ別支出 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">カテゴリ別支出</h2>
        <div className="space-y-3">
          {categoryTotals.map(item => (
            <div key={item.category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{item.category}</span>
              <span className="font-bold text-gray-800">¥{(item.total || 0).toLocaleString()}</span>
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
                <div className="font-bold text-gray-800">¥{(expense.amount || 0).toLocaleString()}</div>
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

      {/* 推し編集フォーム */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">推し情報を編集</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ジャンル</label>
                <select
                  value={editFormData.genre}
                  onChange={(e) => setEditFormData({...editFormData, genre: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VTuber">VTuber</option>
                  <option value="アイドル">アイドル</option>
                  <option value="声優">声優</option>
                  <option value="俳優">俳優</option>
                  <option value="アーティスト">アーティスト</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">アイコン</label>
                <input
                  type="text"
                  value={editFormData.icon}
                  onChange={(e) => setEditFormData({...editFormData, icon: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🎭"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">イメージカラー</label>
                <input
                  type="color"
                  value={editFormData.color}
                  onChange={(e) => setEditFormData({...editFormData, color: e.target.value})}
                  className="w-full p-1 border border-gray-300 rounded-lg h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">誕生日</label>
                <input
                  type="date"
                  value={editFormData.birthday}
                  onChange={(e) => setEditFormData({...editFormData, birthday: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-800">推しを削除</h2>
            </div>
            <p className="text-gray-600 mb-6">
              「{selectedOshi.name}」を削除しますか？この操作は取り消せません。
              関連する支出データも全て削除されます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                削除する
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OshiDetailScreen;