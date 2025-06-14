import React from 'react';
import { Plus, Settings, Download, Upload, Share2, Bell, Calendar } from 'lucide-react';

const SettingsScreen = ({
  oshiList,
  expenses,
  budgets,
  setShowAddBudget,
  exportData,
  shareReport,
  importCSV,
  appTheme,
  setAppTheme,
  themes,
  notificationSettings,
  setNotificationSettings,
  availableIcons,
  setAvailableIcons,
  availableColors,
  setAvailableColors
}) => {
  const handleExportData = () => {
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

  const handleShareReport = () => {
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
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">設定</h2>
          <Settings className="w-6 h-6" />
        </div>
        <p className="text-green-100">アプリの設定とデータ管理</p>
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
            let displayPeriod = budget.period;
            
            if (budget.period === '臨時イベント' && budget.createdAt) {
              const createdDate = new Date(budget.createdAt);
              displayPeriod = `臨時イベント${createdDate.getFullYear()}年${createdDate.getMonth() + 1}月`;
            }
            
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
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">¥{budget.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{displayPeriod}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* データ管理 */}
      {/*
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">データ管理</h2>
        <div className="space-y-3">
          <button
            onClick={exportData || handleExportData}
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
            onClick={shareReport || handleShareReport}
            className="w-full flex items-center gap-3 p-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100"
          >
            <Share2 className="w-5 h-5" />
            支出レポートを共有
          </button>
        </div>
      </div>
      */}

      {/* テーマ設定 */}
      {/*
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
      */}

      {/* アイコン・カラー設定 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm relative">
        <h2 className="text-lg font-bold text-gray-800 mb-4">推しアイコン・カラー設定</h2>
        
        {/* アイコン設定 */}
        <div className="mb-6 relative">
          <h3 className="text-md font-medium text-gray-700 mb-3">アイコン選択肢</h3>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {availableIcons.map((icon, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => {
                    const newIcons = [...availableIcons];
                    newIcons[index] = e.target.value;
                    setAvailableIcons(newIcons);
                  }}
                  className="w-full p-3 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="絵文字"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">※ 絵文字を直接入力してください</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAvailableIcons([...availableIcons, '🎀']);
            }}
            className="absolute bottom-0 right-0 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 z-10"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* カラー設定 */}
        <div className="relative">
          <h3 className="text-md font-medium text-gray-700 mb-3">カラー選択肢</h3>
          <div className="grid grid-cols-4 gap-2">
            {availableColors.map((color, index) => (
              <div key={index} className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...availableColors];
                    newColors[index] = e.target.value;
                    setAvailableColors(newColors);
                  }}
                  className="w-full h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <div 
                  className="absolute inset-0 rounded-lg border-2 border-gray-300 pointer-events-none"
                  style={{ backgroundColor: color }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAvailableColors([...availableColors, '#ff69b4']);
            }}
            className="absolute bottom-0 right-0 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 z-10"
          >
            <Plus className="w-4 h-4" />
          </button>
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
            <button
              onClick={() => setNotificationSettings({
                ...notificationSettings,
                budgetAlert: !notificationSettings.budgetAlert
              })}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                notificationSettings.budgetAlert ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                notificationSettings.budgetAlert ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">推しの誕生日リマインド</span>
            </div>
            <button
              onClick={() => setNotificationSettings({
                ...notificationSettings,
                birthdayReminder: !notificationSettings.birthdayReminder
              })}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                notificationSettings.birthdayReminder ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                notificationSettings.birthdayReminder ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* アプリ情報 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">アプリ情報</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div>バージョン: 1.0.0</div>
          <div>作成日: 2025年6月13日</div>
          <div>開発者: Supa-canpas</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;