import React, { useState, useEffect } from 'react';
import { Plus, Heart, BarChart3, Settings, Calendar } from 'lucide-react';

const CalendarScreen = ({
  oshiList,
  customEvents,
  setCustomEvents,
  showAddEvent,
  setShowAddEvent,
  selectedDate,
  setSelectedDate
}) => {
  const [selectedCalendarOshi, setSelectedCalendarOshi] = useState(null);
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
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
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
    }, [selectedDate]);

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
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-200"
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">
                    {selectedCalendarOshi ? `${selectedCalendarOshi.name}のカレンダー` : '推しカレンダー'}
                  </h2>
                  <Calendar className="w-6 h-6" />
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
                
                <p className="text-purple-100">
                  {selectedCalendarOshi ? `${selectedCalendarOshi.name}の予定をチェック` : '推しの大切な日をチェック'}
                </p>
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
        
      {/* AddEventFormをここに表示 */}
      {showAddEvent && <AddEventForm />}
    </div>
  );
};

export default CalendarScreen;