import React, { useState, useEffect } from 'react';
import { Plus, Heart, BarChart3, Settings, Calendar, Camera, Trash2, Edit, Share2, Download, Upload, Bell, TrendingUp, AlertTriangle } from 'lucide-react';
import AddExpenseForm from './components/forms/AddExpenseForm';
import AddBudgetForm from './components/forms/AddBudgetForm';
import EditExpenseForm from './components/forms/EditExpenseForm';

const OshiKakeiboApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [oshiList, setOshiList] = useState([
    { id: 1, name: 'みくにゃん', genre: 'VTuber', color: '#FF69B4', icon: '🎭', birthday: '2025-07-15' },
    { id: 2, name: 'アイドル太郎', genre: 'アイドル', color: '#87CEEB', icon: '⭐', birthday: '2025-08-20' }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 3500, date: '2025-06-10', category: 'グッズ代', oshiId: 1, note: 'アクリルスタンド', photo: null },
    { id: 2, amount: 8000, date: '2025-06-08', category: 'チケット代', oshiId: 2, note: 'ライブチケット', photo: null },
    { id: 3, amount: 12000, date: '2025-06-05', category: '遠征費', oshiId: 1, note: '交通費・宿泊費', photo: null }
  ]);
  const [budgets, setBudgets] = useState([
    { id: 1, oshiId: 1, category: 'グッズ代', amount: 10000, period: '月次' },
    { id: 2, oshiId: 2, category: 'チケット代', amount: 15000, period: '月次' }
  ]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddOshi, setShowAddOshi] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [selectedOshi, setSelectedOshi] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [appTheme, setAppTheme] = useState('default');
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCalendarOshi, setSelectedCalendarOshi] = useState(null);
  const [customEvents, setCustomEvents] = useState([]);
  const [notificationSettings] = useState({
    budgetAlert: true,
    birthdayReminder: true
  });

  const expenseCategories = ['チケット代', 'グッズ代', '遠征費', '配信チケット代', 'カフェ代', 'その他'];
  const genres = ['アイドル', 'VTuber', 'アニメ', '俳優', '鉄道', 'ゲーム', 'その他'];
  const colors = ['#FF69B4', '#87CEEB', '#98FB98', '#FFB6C1', '#DDA0DD', '#F0E68C', '#FF7F50', '#40E0D0'];
  const themes = {
    default: { primary: '#FF69B4', secondary: '#87CEEB', accent: '#98FB98' },
    pink: { primary: '#FF1493', secondary: '#FFB6C1', accent: '#FFC0CB' },
    blue: { primary: '#4169E1', secondary: '#87CEEB', accent: '#B0E0E6' },
    purple: { primary: '#8A2BE2', secondary: '#DDA0DD', accent: '#E6E6FA' },
    green: { primary: '#32CD32', secondary: '#98FB98', accent: '#F0FFF0' }
  };

  // 予算超過チェック
  useEffect(() => {
    // 通知がOFFの場合は通知しない
    if (!notificationSettings.budgetAlert) return;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newNotifications = [];
    
    budgets.forEach(budget => {
      const monthlyExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return exp.oshiId === budget.oshiId && 
               exp.category === budget.category &&
               expDate.getMonth() === currentMonth &&
               expDate.getFullYear() === currentYear;
      });
      
      const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = (totalSpent / budget.amount) * 100;
      
      if (percentage >= 80) {
        const oshi = oshiList.find(o => o.id === budget.oshiId);
        newNotifications.push({
          id: `budget-${budget.id}`,
          type: percentage >= 100 ? 'over' : 'warning',
          message: `${oshi?.name}の${budget.category}が予算の${Math.round(percentage)}%に達しました`,
          oshi: oshi
        });
      }
    });
    
    setNotifications(newNotifications);
  }, [expenses, budgets, oshiList, notificationSettings.budgetAlert]);

  // 誕生日通知チェック
  useEffect(() => {
    // 通知がOFFの場合は通知しない
    if (!notificationSettings.birthdayReminder) return;
    
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    oshiList.forEach(oshi => {
      if (oshi.birthday) {
        const birthdayStr = new Date(oshi.birthday).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
        if (birthdayStr === todayStr) {
          setNotifications(prev => [...prev, {
            id: `birthday-${oshi.id}`,
            type: 'birthday',
            message: `今日は${oshi.name}の誕生日です！🎉`,
            oshi: oshi
          }]);
        }
      }
    });
  }, [oshiList, notificationSettings.birthdayReminder]);

  const deleteExpense = (expenseId) => {
    if (window.confirm('この支出を削除しますか？')) {
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
    }
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
    setShowEditExpense(true);
  };

  const importCSV = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          // const headers = lines[0].split(',');
          
          const importedExpenses = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 4) {
              importedExpenses.push({
                id: Date.now() + i,
                amount: parseInt(values[0]) || 0,
                date: values[1] || new Date().toISOString().split('T')[0],
                category: values[2] || 'その他',
                oshiId: parseInt(values[3]) || oshiList[0]?.id || 1,
                note: values[4] || '',
                photo: null
              });
            }
          }
          
          setExpenses([...expenses, ...importedExpenses]);
          alert(`${importedExpenses.length}件の支出データをインポートしました`);
        } catch (error) {
          alert('CSVファイルの読み込みに失敗しました');
        }
      };
      reader.readAsText(file);
    }
  };

  const getTotalExpensesByOshi = (oshiId, period = 'all') => {
    let filteredExpenses = expenses.filter(exp => exp.oshiId === oshiId);
    
    if (period === 'month') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      filteredExpenses = filteredExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      });
    }
    
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getTotalBudgetUsageByOshi = (oshiId) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // その推しの全予算を取得
    const oshiBudgets = budgets.filter(b => b.oshiId === oshiId);
    
    if (oshiBudgets.length === 0) {
      return { totalBudget: 0, totalSpent: 0, percentage: 0 };
    }
    
    // その推しの全予算の合計
    const totalBudget = oshiBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    
    // その推しへの月次累計支出（全カテゴリ）
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return exp.oshiId === oshiId && 
             expDate.getMonth() === currentMonth &&
             expDate.getFullYear() === currentYear;
    });
    
    const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return { totalBudget, totalSpent, percentage };
  };

  const getBudgetUsage = (oshiId, category) => {
    const budget = budgets.find(b => b.oshiId === oshiId && b.category === category);
    if (!budget) return { spent: 0, budget: 0, percentage: 0 };
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return exp.oshiId === oshiId && 
             exp.category === category &&
             expDate.getMonth() === currentMonth &&
             expDate.getFullYear() === currentYear;
    });
    
    const spent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentage = (spent / budget.amount) * 100;
    
    return { spent, budget: budget.amount, percentage };
  };


  const AddOshiForm = () => {
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
      
      console.log('Form submitted with data:', formData); // デバッグ用
      
      if (formData.name && formData.genre) {
        const newOshi = {
          id: Date.now(),
          ...formData
        };
        console.log('Adding new oshi:', newOshi); // デバッグ用
        
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
        console.log('Validation failed:', { name: formData.name, genre: formData.genre }); // デバッグ用
        alert('推しの名前とジャンルを入力してください');
      }
    };

    const handleAddClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Add button clicked'); // デバッグ用
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

  const HomeScreen = () => {
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
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">今月の推し活</h2>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              ¥{totalMonthlyExpenses.toLocaleString()}
            </div>
            <p className="text-pink-100/90 text-lg">今月の合計支出</p>
          </div>
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
                  className="bg-white rounded-3xl p-6 shadow-lg border border-gray-50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90"
                  onClick={() => {
                    setSelectedOshi(oshi);
                    setCurrentScreen('oshi-detail');
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                      style={{ 
                        backgroundColor: oshi.color,
                        boxShadow: `0 8px 24px ${oshi.color}30`
                      }}
                    >
                      {oshi.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{oshi.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{oshi.genre}</p>
                      
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
                      <div className="text-2xl font-bold text-gray-900">¥{monthlyTotal.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 font-medium">今月 / 総計¥{allTimeTotal.toLocaleString()}</div>
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
                <div key={expense.id} className="bg-white rounded-2xl p-5 shadow-md border border-gray-50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md"
                        style={{ 
                          backgroundColor: oshi?.color,
                          boxShadow: `0 4px 12px ${oshi?.color}20`
                        }}
                      >
                        {oshi?.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{expense.category}</div>
                        <div className="text-sm text-gray-500 font-medium">{oshi?.name} • {expense.note}</div>
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
                        <div className="font-bold text-gray-900 text-xl">¥{expense.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{expense.date}</div>
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

  const OshiDetailScreen = () => {
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
          className="rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
          style={{ backgroundColor: selectedOshi.color }}
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl shadow-lg">
                {selectedOshi.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{selectedOshi.name}</h1>
                <p className="opacity-90 text-lg">{selectedOshi.genre}</p>
              </div>
            </div>
          
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold">¥{monthlyTotal.toLocaleString()}</div>
                <div className="text-sm opacity-90 mt-2">今月の支出</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold">¥{allTimeTotal.toLocaleString()}</div>
                <div className="text-sm opacity-90 mt-2">総支出</div>
              </div>
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

  const AnalyticsScreen = () => {
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
        <div className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">分析・レポート</h2>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              ¥{totalThisMonth.toLocaleString()}
            </div>
            <p className="text-blue-100/90 text-lg">今月の総支出</p>
          </div>
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

  const SettingsScreen = () => {
    const exportData = () => {
      const data = {
        oshiList,
        expenses,
        budgets,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `oshi-kakeibo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const shareReport = () => {
      const totalThisMonth = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      const text = `今月の推し活支出: ¥${totalThisMonth.toLocaleString()}\n推し活家計簿で管理中💕 #推し活 #家計簿 #推し活記録`;
      
      if (navigator.share) {
        navigator.share({
          title: '推し活支出レポート',
          text: text
        });
      } else {
        navigator.clipboard.writeText(text);
        alert('レポートをクリップボードにコピーしました！');
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">設定</h2>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Settings className="w-6 h-6" />
              </div>
            </div>
            <p className="text-emerald-100/90 text-lg">アプリの設定とデータ管理</p>
          </div>
        </div>

        {/* 予算設定 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">予算設定</h2>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddBudget(true);
              }}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 z-10 relative"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {budgets.map(budget => {
              const oshi = oshiList.find(o => o.id === budget.oshiId);
              return (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: oshi?.color }}
                    >
                      {oshi?.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{oshi?.name}</div>
                      <div className="text-sm text-gray-600">{budget.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">¥{budget.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{budget.period}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* データ管理 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">データ管理</h2>
          <div className="space-y-3">
            <button
              onClick={exportData}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <Download className="w-5 h-5" />
              データをエクスポート
            </button>
            
            <label className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 cursor-pointer">
              <Upload className="w-5 h-5" />
              CSVをインポート
              <input
                type="file"
                accept=".csv"
                onChange={importCSV}
                className="hidden"
              />
            </label>
            
            <button
              onClick={shareReport}
              className="w-full flex items-center gap-3 p-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100"
            >
              <Share2 className="w-5 h-5" />
              支出レポートを共有
            </button>
          </div>
        </div>

        {/* テーマ設定 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">テーマ設定</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(themes).map(([themeName, theme]) => (
              <button
                key={themeName}
                onClick={() => setAppTheme(themeName)}
                className={`p-3 rounded-lg border-2 ${
                  appTheme === themeName ? 'border-gray-800' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 capitalize">{themeName}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 通知設定 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">通知設定</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">予算超過アラート</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">推しの誕生日リマインド</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* アプリ情報 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">アプリ情報</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div>バージョン: 1.0.0</div>
            <div>作成日: 2025年6月13日</div>
            <div>開発者: お姉様</div>
          </div>
        </div>
      </div>
    );
  };


  const CameraScreen = () => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [ocrResult, setOcrResult] = useState('');

    const simulateOCR = (imageData) => {
      // OCR機能のシミュレーション
      const mockResults = [
        { amount: 3500, store: 'アニメイト', items: 'アクリルスタンド' },
        { amount: 8000, store: 'チケットぴあ', items: 'ライブチケット' },
        { amount: 1200, store: 'セブンイレブン', items: 'ドリンク・お菓子' },
        { amount: 2500, store: 'ローソン', items: 'クリアファイル' }
      ];
      
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      setOcrResult(`金額: ¥${result.amount}\n店舗: ${result.store}\n商品: ${result.items}`);
      
      // 自動で支出追加画面に遷移
      setTimeout(() => {
        setShowCamera(false);
        setShowAddExpense(true);
        // フォームに自動入力（実際のOCRではここで解析結果を使用）
      }, 2000);
    };

    const handleCapture = () => {
      // カメラキャプチャのシミュレーション
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 320, 240);
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText('レシート画像', 120, 120);
      
      const imageData = canvas.toDataURL();
      setCapturedImage(imageData);
      simulateOCR(imageData);
    };

    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 bg-black text-white">
            <button
              onClick={() => {
                setShowCamera(false);
                setShowAddExpense(true);
              }}
              className="text-white"
            >
              ← 戻る
            </button>
            <h2 className="text-lg font-bold">レシートを撮影</h2>
            <div className="w-8"></div>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            {!capturedImage ? (
              <div className="text-center">
                <div className="w-64 h-48 border-2 border-dashed border-white rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <p className="text-white mb-4">レシートをフレーム内に収めて撮影してください</p>
                <button
                  onClick={handleCapture}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <img src={capturedImage} alt="撮影されたレシート" className="w-64 h-48 rounded-lg mb-4" />
                <div className="text-white mb-4">
                  <p className="mb-2">📸 画像を解析中...</p>
                  {ocrResult && (
                    <div className="bg-white text-black p-4 rounded-lg text-left">
                      <h3 className="font-bold mb-2">認識結果:</h3>
                      <pre className="text-sm">{ocrResult}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CalendarScreen = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    
    // 推しの誕生日とカスタムイベントを取得
    const allEvents = [
      // 誕生日イベント
      ...oshiList.map(oshi => {
        if (oshi.birthday) {
          const birthday = new Date(oshi.birthday);
          return {
            id: `birthday-${oshi.id}`,
            date: birthday.getDate(),
            month: birthday.getMonth(),
            year: birthday.getFullYear(),
            type: 'birthday',
            oshi: oshi,
            title: `${oshi.name}の誕生日`,
            description: '🎂 お誕生日おめでとう！'
          };
        }
        return null;
      }).filter(Boolean),
      // カスタムイベント
      ...customEvents
    ];

    // 選択された推しのイベントのみフィルタリング
    const events = selectedCalendarOshi 
      ? allEvents.filter(event => event.oshi?.id === selectedCalendarOshi.id)
      : allEvents;

    // カレンダーの日付を生成
    const firstDay = new Date(currentYear, currentMonth, 1);
    // const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    const handleDateClick = (date) => {
      setSelectedDate(date);
      setShowAddEvent(true);
    };

    // 前の月に移動
    const goToPreviousMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    // 次の月に移動
    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    // 今月に戻る
    const goToToday = () => {
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
    };

    // AddEventFormをCalendarScreen内に移動
    const AddEventForm = () => {
      const [formData, setFormData] = useState({
        title: '',
        description: '',
        oshiId: '',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: 'custom'
      });

      // selectedDateが変更されたときにformDataの日付を更新
      useEffect(() => {
        if (selectedDate) {
          setFormData(prev => ({
            ...prev,
            date: selectedDate.toISOString().split('T')[0]
          }));
        }
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (formData.title && formData.oshiId && formData.date) {
          const eventDate = new Date(formData.date);
          const selectedOshi = oshiList.find(o => o.id === parseInt(formData.oshiId));
          
          const newEvent = {
            id: `custom-${Date.now()}`,
            title: formData.title,
            description: formData.description,
            date: eventDate.getDate(),
            month: eventDate.getMonth(),
            year: eventDate.getFullYear(),
            type: 'custom',
            oshi: selectedOshi
          };
          
          setCustomEvents([...customEvents, newEvent]);
          setShowAddEvent(false);
          setSelectedDate(null);
          setFormData({
            title: '',
            description: '',
            oshiId: '',
            date: new Date().toISOString().split('T')[0],
            type: 'custom'
          });
        } else {
          alert('タイトル、推し、日付を入力してください');
        }
      };

      const handleAddEventClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(e);
      };

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">予定を追加</h2>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAddEvent(false);
                  setSelectedDate(null);
                }} 
                className="text-gray-500 hover:text-gray-700 p-1 z-10 relative cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">予定のタイトル</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="例：ライブ、握手会、誕生日会など"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">推し</label>
                <select 
                  value={formData.oshiId} 
                  onChange={(e) => setFormData({...formData, oshiId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">推しを選択</option>
                  {oshiList.map(oshi => (
                    <option key={oshi.id} value={oshi.id}>{oshi.icon} {oshi.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">詳細（任意）</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="場所や時間、メモなど"
                  rows="3"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAddEvent(false);
                    setSelectedDate(null);
                  }}
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 z-10 relative cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleAddEventClick}
                  className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 z-10 relative cursor-pointer"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowAddEvent(true);
            }}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-200 z-10 relative"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
          
                {/* 推し選択 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">カレンダー表示</h2>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedCalendarOshi(null)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        !selectedCalendarOshi 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      全体表示
                    </button>
                    {oshiList.map(oshi => (
                      <button
                        key={oshi.id}
                        onClick={() => setSelectedCalendarOshi(oshi)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedCalendarOshi?.id === oshi.id
                            ? 'text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={selectedCalendarOshi?.id === oshi.id ? { backgroundColor: oshi.color } : {}}
                      >
                        <span>{oshi.icon}</span>
                        <span>{oshi.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 月表示 */}
                <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">
                        {selectedCalendarOshi ? `${selectedCalendarOshi.name}のカレンダー` : '推しカレンダー'}
                      </h2>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                  
                  {/* 月移動コントロール */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    >
                      <span className="text-lg font-bold">←</span>
                    </button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {currentYear}年 {monthNames[currentMonth]}
                      </div>
                      {/* 今月に戻るボタン */}
                      {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
                        <button
                          onClick={goToToday}
                          className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition-all"
                        >
                          今月に戻る
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={goToNextMonth}
                      className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    >
                      <span className="text-lg font-bold">→</span>
                    </button>
                  </div>
                  
                    <p className="text-purple-100/90 text-lg">
                      {selectedCalendarOshi ? `${selectedCalendarOshi.name}の予定をチェック` : '推しの大切な日をチェック'}
                    </p>
                  </div>
                </div>
                
                {/* かわいいカレンダーグリッド */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                      <div key={day} className={`text-center text-xs font-bold p-2 ${
                        index === 0 ? 'text-red-400' : 
                        index === 6 ? 'text-blue-400' : 
                        'text-gray-500'
                      }`}>
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                      const isCurrentMonth = date.getMonth() === currentMonth;
                      const isToday = date.toDateString() === today.toDateString();
                      const dayEvents = events.filter(event => 
                        event.date === date.getDate() && 
                        event.month === date.getMonth()
                      );

                      return (
                        <div
                          key={index}
                          onClick={() => isCurrentMonth && handleDateClick(date)}
                          className={`relative aspect-square rounded-xl p-2 transition-all cursor-pointer ${
                            !isCurrentMonth 
                              ? 'text-gray-300 bg-gray-50' 
                              : isToday 
                                ? 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 border-2 border-pink-300 shadow-lg transform scale-105' 
                                : dayEvents.length > 0
                                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:shadow-md'
                                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-purple-200 hover:shadow-sm'
                          }`}
                        >
                          <div className={`text-center text-sm font-medium ${
                            isToday 
                              ? 'text-pink-600 font-bold' 
                              : isCurrentMonth 
                                ? dayEvents.length > 0 ? 'text-purple-700' : 'text-gray-700'
                                : 'text-gray-400'
                          }`}>
                            {date.getDate()}
                          </div>
                          
                          {/* 今日のキラキラマーク */}
                          {isToday && (
                            <div className="absolute top-1 right-1">
                              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                          
                          {/* イベントドット */}
                          {dayEvents.length > 0 && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="w-1.5 h-1.5 rounded-full shadow-sm"
                                  style={{ 
                                    backgroundColor: event.oshi?.color || '#8B5CF6',
                                  }}
                                />
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-purple-500 font-bold">
                                  +{dayEvents.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* イベント一覧 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    {monthNames[currentMonth]}の予定 {selectedCalendarOshi && `(${selectedCalendarOshi.name})`}
                  </h2>
                  
                  {events.filter(event => event.month === currentMonth).length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3 text-gray-400">📅</div>
                      <p className="text-gray-500 font-medium">
                        {monthNames[currentMonth]}は予定がありません
                      </p>
                      <p className="text-sm text-gray-400 mt-1">右上の＋ボタンから予定を追加できます</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {events
                        .filter(event => event.month === currentMonth)
                        .sort((a, b) => a.date - b.date)
                        .map((event, index) => (
                          <div 
                            key={event.id || index} 
                            className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-xl border border-purple-100"
                          >
                            <div className="flex items-center gap-4">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
                                style={{ backgroundColor: event.oshi?.color || '#8B5CF6' }}
                              >
                                {event.oshi?.icon || '📅'}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-800 flex items-center gap-2">
                                  <span>{event.title}</span>
                                  {event.type === 'birthday' && <span>🎂</span>}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {currentMonth + 1}月{event.date}日
                                  {event.date === today.getDate() && 
                                   event.month === today.getMonth() && 
                                   currentYear === today.getFullYear() && (
                                    <span className="ml-2 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">
                                      今日！
                                    </span>
                                  )}
                                </div>
                                {event.description && (
                                  <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* 統計情報 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">統計情報</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedCalendarOshi ? 1 : oshiList.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedCalendarOshi ? '表示中の推し' : '登録推し数'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-pink-600">
                        {events.length}
                      </div>
                      <div className="text-sm text-gray-600">年間予定数</div>
                    </div>
                  </div>
                </div>
              </div>

        {/* AddEventFormをここに表示 */}
        {showAddEvent && <AddEventForm />}
      </div>
    );
  };


  const PhotoViewer = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="relative">
          <button
            onClick={() => {setShowPhotoViewer(false); setSelectedPhoto(null);}}
            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
          <img 
            src={selectedPhoto} 
            alt="拡大表示" 
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ヘッダー */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {currentScreen !== 'home' && (
              <button
                onClick={() => {
                  if (currentScreen === 'oshi-detail') {
                    setSelectedOshi(null);
                  }
                  setCurrentScreen('home');
                }}
                className="text-gray-700 hover:text-gray-900 z-10 relative font-medium"
              >
                ← 戻る
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">
              {currentScreen === 'home' && '推し活家計簿'}
              {currentScreen === 'analytics' && '分析・レポート'}
              {currentScreen === 'settings' && '設定'}
              {currentScreen === 'calendar' && '推しカレンダー'}
              {currentScreen === 'oshi-detail' && selectedOshi?.name}
            </h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24 pt-20 min-h-screen">
        <div className="space-y-6">
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'analytics' && <AnalyticsScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
          {currentScreen === 'calendar' && (
            <CalendarScreen
              oshiList={oshiList}
              customEvents={customEvents}
              setCustomEvents={setCustomEvents}
              showAddEvent={showAddEvent}
              setShowAddEvent={setShowAddEvent}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
          {currentScreen === 'oshi-detail' && <OshiDetailScreen />}
        </div>
      </div>

      {/* フローティングアクションボタン */}
      {currentScreen === 'home' && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddExpense(true);
          }}
          className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 flex items-center justify-center z-50 touch-manipulation transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* ボトムナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40 shadow-lg">
        <div className="max-w-md mx-auto px-6">
          <div className="flex justify-around py-3">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentScreen === 'home' 
                  ? 'text-pink-500 bg-pink-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs mt-1">ホーム</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('calendar')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentScreen === 'calendar' 
                  ? 'text-purple-500 bg-purple-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs mt-1">カレンダー</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('analytics')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentScreen === 'analytics' 
                  ? 'text-blue-500 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs mt-1">分析</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentScreen === 'settings' 
                  ? 'text-green-500 bg-green-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">設定</span>
            </button>
          </div>
        </div>
      </div>

      {/* モーダル */}
      {showAddExpense && (
        <AddExpenseForm
          expenses={expenses}
          setExpenses={setExpenses}
          oshiList={oshiList}
          expenseCategories={expenseCategories}
          setShowAddExpense={setShowAddExpense}
          setShowCamera={setShowCamera}
          setSelectedPhoto={setSelectedPhoto}
          setShowPhotoViewer={setShowPhotoViewer}
        />
      )}
      {showAddOshi && <AddOshiForm />}
      {showAddBudget && (
        <AddBudgetForm
          budgets={budgets}
          setBudgets={setBudgets}
          oshiList={oshiList}
          expenseCategories={expenseCategories}
          setShowAddBudget={setShowAddBudget}
        />
      )}
      {showEditExpense && (
        <EditExpenseForm
          expenses={expenses}
          setExpenses={setExpenses}
          oshiList={oshiList}
          expenseCategories={expenseCategories}
          setShowEditExpense={setShowEditExpense}
          editingExpense={editingExpense}
          setEditingExpense={setEditingExpense}
        />
      )}
      {showCamera && <CameraScreen />}
      {showPhotoViewer && <PhotoViewer />}
    </div>
  );
};

export default OshiKakeiboApp;