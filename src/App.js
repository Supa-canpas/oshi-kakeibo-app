import React, { useState, useEffect } from 'react';
import { Plus, Heart, BarChart3, Settings, Calendar, Camera, Trash2, Edit, Share2, Download, Upload, Bell, TrendingUp, AlertTriangle } from 'lucide-react';
import AddExpenseForm from './components/forms/AddExpenseForm';
import AddBudgetForm from './components/forms/AddBudgetForm';
import AddOshiForm from './components/forms/AddOshiForm';
import EditExpenseForm from './components/forms/EditExpenseForm';
import CalendarScreen from './components/screens/CalendarScreen';
import HomeScreen from './components/screens/HomeScreen';
import AnalyticsScreen from './components/screens/AnalyticsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import OshiDetailScreen from './components/screens/OshiDetailScreen';

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
    { id: 1, oshiId: 1, amount: 10000, period: '毎月' },
    { id: 2, oshiId: 2, amount: 15000, period: '毎月' }
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
  const [customEvents, setCustomEvents] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlert: true,
    birthdayReminder: true
  });

  const expenseCategories = ['チケット代', 'グッズ代', '遠征費', '配信チケット代', 'カフェ代', 'その他'];
  const genres = ['アイドル', 'VTuber', 'アニメ', '俳優', '鉄道', 'ゲーム', 'その他'];
  const [availableIcons, setAvailableIcons] = useState(['🎭', '⭐', '🎤', '💕', '🌟', '🎵', '🎨', '💎']);
  const [availableColors, setAvailableColors] = useState(['#FF69B4', '#87CEEB', '#98FB98', '#FFB6C1', '#DDA0DD', '#F0E68C', '#FF7F50', '#40E0D0']);
  const themes = {
    default: { primary: '#FF69B4', secondary: '#87CEEB', accent: '#98FB98' },
    pink: { primary: '#FF1493', secondary: '#FFB6C1', accent: '#FFC0CB' },
    blue: { primary: '#4169E1', secondary: '#87CEEB', accent: '#B0E0E6' },
    purple: { primary: '#8A2BE2', secondary: '#DDA0DD', accent: '#E6E6FA' },
    green: { primary: '#32CD32', secondary: '#98FB98', accent: '#F0FFF0' }
  };

  // 予算超過チェックと月次処理
  useEffect(() => {
    if (!notificationSettings.budgetAlert) return;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newNotifications = [];
    
    budgets.forEach(budget => {
      // アラートは毎月予算と今月の臨時イベント予算も表示
      let shouldCheck = false;
      if (budget.period === '毎月') {
        shouldCheck = true;
      } else if (budget.period === '臨時イベント') {
        const budgetCreatedAt = new Date(budget.createdAt || Date.now());
        shouldCheck = budgetCreatedAt.getMonth() === currentMonth && 
                     budgetCreatedAt.getFullYear() === currentYear;
      }
      
      if (!shouldCheck) return;
      
      const monthlyExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return exp.oshiId === budget.oshiId && 
               expDate.getMonth() === currentMonth &&
               expDate.getFullYear() === currentYear;
      });
      
      // 同じ推しの全ての対象予算を合計
      const oshiBudgets = budgets.filter(b => {
        if (b.oshiId !== budget.oshiId) return false;
        if (b.period === '毎月') return true;
        if (b.period === '臨時イベント') {
          const bCreatedAt = new Date(b.createdAt || Date.now());
          return bCreatedAt.getMonth() === currentMonth && 
                 bCreatedAt.getFullYear() === currentYear;
        }
        return false;
      });
      
      const totalBudget = oshiBudgets.reduce((sum, b) => sum + b.amount, 0);
      const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      
      if (percentage >= 80) {
        const oshi = oshiList.find(o => o.id === budget.oshiId);
        const existingNotification = newNotifications.find(n => n.id === `budget-${budget.oshiId}`);
        
        if (!existingNotification) {
          newNotifications.push({
            id: `budget-${budget.oshiId}`,
            type: percentage >= 100 ? 'over' : 'warning',
            message: `${oshi?.name}の予算が${Math.round(percentage)}%に達しました`,
            oshi: oshi
          });
        }
      }
    });
    
    // 既存の誕生日通知を保持して、予算通知を更新
    setNotifications(prev => {
      const birthdayNotifications = prev.filter(n => n.type === 'birthday');
      return [...birthdayNotifications, ...newNotifications];
    });
  }, [expenses, budgets, oshiList, notificationSettings.budgetAlert]);

  // 月替わり時の臨時イベント予算削除
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // 前月以前の臨時イベント予算を削除
    const filteredBudgets = budgets.filter(budget => {
      if (budget.period !== '臨時イベント') return true;
      
      const budgetCreatedAt = new Date(budget.createdAt || Date.now());
      return budgetCreatedAt.getMonth() === currentMonth && 
             budgetCreatedAt.getFullYear() === currentYear;
    });
    
    if (filteredBudgets.length !== budgets.length) {
      setBudgets(filteredBudgets);
    }
  }, [budgets, setBudgets]);

  // 誕生日通知チェック
  useEffect(() => {
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

  const updateOshi = (oshiId, updatedData) => {
    setOshiList(oshiList.map(oshi => 
      oshi.id === oshiId ? { ...oshi, ...updatedData } : oshi
    ));
    // selectedOshiも更新
    if (selectedOshi && selectedOshi.id === oshiId) {
      setSelectedOshi({ ...selectedOshi, ...updatedData });
    }
  };

  const deleteOshi = (oshiId) => {
    // 推しを削除
    setOshiList(oshiList.filter(oshi => oshi.id !== oshiId));
    // 関連する支出データも削除
    setExpenses(expenses.filter(exp => exp.oshiId !== oshiId));
    // 関連する予算データも削除
    setBudgets(budgets.filter(budget => budget.oshiId !== oshiId));
    // selectedOshiをリセット
    if (selectedOshi && selectedOshi.id === oshiId) {
      setSelectedOshi(null);
    }
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
    
    // 毎月予算と今月作成された臨時イベント予算を対象とする
    const oshiBudgets = budgets.filter(b => {
      if (b.oshiId !== oshiId) return false;
      
      if (b.period === '毎月') {
        return true;
      }
      
      if (b.period === '臨時イベント') {
        const budgetCreatedAt = new Date(b.createdAt || Date.now());
        return budgetCreatedAt.getMonth() === currentMonth && 
               budgetCreatedAt.getFullYear() === currentYear;
      }
      
      return false;
    });
    
    if (oshiBudgets.length === 0) {
      return { totalBudget: 0, totalSpent: 0, percentage: 0 };
    }
    
    const totalBudget = oshiBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    
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

  const getBudgetUsage = (oshiId, category = null) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // カテゴリ別の予算使用率を計算
    if (category) {
      const categoryExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return exp.oshiId === oshiId && 
               exp.category === category &&
               expDate.getMonth() === currentMonth &&
               expDate.getFullYear() === currentYear;
      });
      
      const totalSpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // カテゴリ別の予算上限を設定（仮の値、実際は設定から取得）
      const categoryBudgetLimits = {
        'チケット代': 30000,
        'グッズ代': 20000,
        '遠征費': 50000,
        '配信チケット代': 10000,
        'カフェ代': 15000,
        'その他': 10000
      };
      
      const budgetLimit = categoryBudgetLimits[category] || 10000;
      const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
      
      return { totalBudget: budgetLimit, totalSpent, percentage };
    }
    
    // 全体の予算使用率を返す
    return getTotalBudgetUsageByOshi(oshiId);
  };


  // その他のコンポーネント定義は省略（HomeScreen, AnalyticsScreen, SettingsScreen, etc.）
  // ここでは外部ファイルからインポートすることを前提とします

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ヘッダー */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-6 py-5">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentScreen === 'home' && '推し活家計簿'}
              {currentScreen === 'analytics' && '分析・レポート'}
              {currentScreen === 'settings' && '設定'}
              {currentScreen === 'calendar' && '推しカレンダー'}
              {currentScreen === 'oshi-detail' && selectedOshi?.name}
            </h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24 pt-20 min-h-screen">
        <div className="space-y-6">
          {currentScreen === 'home' && (
            <HomeScreen
              expenses={expenses}
              oshiList={oshiList}
              budgets={budgets}
              notifications={notifications}
              setSelectedOshi={setSelectedOshi}
              setCurrentScreen={setCurrentScreen}
              setShowAddOshi={setShowAddOshi}
              editExpense={editExpense}
              deleteExpense={deleteExpense}
              setSelectedPhoto={setSelectedPhoto}
              setShowPhotoViewer={setShowPhotoViewer}
              getTotalExpensesByOshi={getTotalExpensesByOshi}
              getTotalBudgetUsageByOshi={getTotalBudgetUsageByOshi}
            />
          )}
          {currentScreen === 'analytics' && (
            <AnalyticsScreen
              expenses={expenses}
              oshiList={oshiList}
              getTotalExpensesByOshi={getTotalExpensesByOshi}
              expenseCategories={expenseCategories}
            />
          )}
          {currentScreen === 'settings' && (
            <SettingsScreen
              oshiList={oshiList}
              expenses={expenses}
              budgets={budgets}
              setShowAddBudget={setShowAddBudget}
              exportData={null}
              shareReport={null}
              importCSV={importCSV}
              appTheme={appTheme}
              setAppTheme={setAppTheme}
              themes={themes}
              notificationSettings={notificationSettings}
              setNotificationSettings={setNotificationSettings}
              availableIcons={availableIcons}
              setAvailableIcons={setAvailableIcons}
              availableColors={availableColors}
              setAvailableColors={setAvailableColors}
            />
          )}
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
          {currentScreen === 'oshi-detail' && (
            <OshiDetailScreen
              selectedOshi={selectedOshi}
              expenses={expenses}
              oshiList={oshiList}
              budgets={budgets}
              getTotalExpensesByOshi={getTotalExpensesByOshi}
              getBudgetUsage={getBudgetUsage}
              editExpense={editExpense}
              deleteExpense={deleteExpense}
              setSelectedPhoto={setSelectedPhoto}
              setShowPhotoViewer={setShowPhotoViewer}
              expenseCategories={expenseCategories}
              updateOshi={updateOshi}
              deleteOshi={deleteOshi}
              setCurrentScreen={setCurrentScreen}
            />
          )}
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
      
      {showAddOshi && (
        <AddOshiForm
          oshiList={oshiList}
          setOshiList={setOshiList}
          setShowAddOshi={setShowAddOshi}
          colors={availableColors}
          icons={availableIcons}
          genres={genres}
        />
      )}
      
      {showAddBudget && (
        <AddBudgetForm
          budgets={budgets}
          setBudgets={setBudgets}
          oshiList={oshiList}
          expenseCategories={expenseCategories}
          setShowAddBudget={setShowAddBudget}
        />
      )}
      
      {showEditExpense && editingExpense && (
        <EditExpenseForm
          editingExpense={editingExpense}
          expenses={expenses}
          setExpenses={setExpenses}
          oshiList={oshiList}
          expenseCategories={expenseCategories}
          setShowEditExpense={setShowEditExpense}
          setEditingExpense={setEditingExpense}
        />
      )}
    </div>
  );
};

export default OshiKakeiboApp;