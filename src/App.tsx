import { useCallback, useEffect, useState } from 'react';
// import { invoke } from '@tauri-apps/api/core';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import { useWebSocket } from './components/WebSocketProvider';
import AppLayout from './components/layout/AppLayout';
import DevicesView from './views/devices/DevicesView';
import SettingsView from './views/settings/SettingsView';
import TiktokView from './views/tiktok/TiktokView';
type TabKey = 'devices' | 'tiktok' | 'history' | 'settings';

function App() {
  const { wsConnected } = useWebSocket();
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabKey>('devices');

  // Handle tab changes
  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    if (wsConnected) {
      setIsLoading(false);
    }
  }, [wsConnected]);

  // Render màn hình loading nếu đang trong quá trình kết nối server
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'devices' && <DevicesView />}
      {activeTab === 'tiktok' && <TiktokView />}
      {activeTab === 'history' && <div>Lịch sử hoạt động</div>}
      {activeTab === 'settings' && <SettingsView />}
    </AppLayout>
  );
}

export default App;
