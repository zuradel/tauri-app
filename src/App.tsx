import { useCallback, useEffect, useState } from 'react';
// import { invoke } from '@tauri-apps/api/core';
import './App.css';
import { WebSocketProvider } from './components/WebSocketProvider';
import LoadingScreen from './components/LoadingScreen';
import AppLayout from './components/layout/AppLayout';
import DevicesView from './views/devices/DevicesView';
import TiktokView from './views/tiktok/TiktokView';
import SettingsView from './views/settings/SettingsView';

type TabKey = 'devices' | 'tiktok' | 'history' | 'settings';

function App() {
  const [serverStatus, setServerStatus] = useState<
    'starting' | 'running' | 'error'
  >('starting');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('devices');

  // Kiểm tra kết nối server
  const checkServerConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8008/api/v1/connect');
      if (response.ok) {
        setServerStatus('running');
        return true;
      } else {
        setServerStatus('error');
        const errorMessage = `Server responded with status: ${response.status}`;
        setServerError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error checking server connection:', error);
      setServerStatus('error');
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setServerError(errorMessage);
      return false;
    }
  }, []);

  // Đợi kết nối đến server
  useEffect(() => {
    const waitForServer = async () => {
      // Đợi server khởi động (tối đa 10 lần, 500ms mỗi lần)
      let isRunning = false;

      for (let i = 0; i < 10; i++) {
        console.log(`Checking server connection attempt ${i + 1}...`);
        isRunning = await checkServerConnection();

        if (isRunning) {
          console.log('Server connection established!');
          break;
        }

        // Đợi 500ms trước khi thử lại
        if (i < 9) {
          // Không đợi sau lần cuối cùng
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Sau khi thử kết nối server nhiều lần, cập nhật trạng thái
      if (!isRunning) {
        setLoadingError(
          `Không thể kết nối đến server sau nhiều lần thử. ${serverError || ''}`
        );
      }

      // Sau 1s hiển thị kết quả, hiển thị ứng dụng chính
      setTimeout(
        () => {
          setIsLoading(false);
        },
        isRunning ? 500 : 1000
      );
    };

    waitForServer();
  }, [checkServerConnection, serverError]);

  // Xử lý khi người dùng bấm nút tiếp tục từ màn hình loading
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle tab changes
  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  // Render màn hình loading nếu đang trong quá trình kết nối server
  if (isLoading) {
    return (
      <LoadingScreen onComplete={handleLoadingComplete} error={loadingError} />
    );
  }

  return (
    <WebSocketProvider wsUrl='ws://localhost:8008/ws'>
      <AppLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        serverStatus={serverStatus}
      >
        {activeTab === 'devices' && <DevicesView />}
        {activeTab === 'tiktok' && <TiktokView />}
        {activeTab === 'history' && <div>Lịch sử hoạt động</div>}
        {activeTab === 'settings' && <SettingsView />}
      </AppLayout>
    </WebSocketProvider>
  );
}

export default App;
