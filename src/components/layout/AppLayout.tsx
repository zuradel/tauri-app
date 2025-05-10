import React, { useState, useEffect } from 'react';
import { Moon, Sun, Smartphone, Settings, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { invoke } from '@tauri-apps/api/core';

// Define the SystemInfo interface to match the Rust struct
interface SystemInfo {
  cpu_usage: number;
  ram_total: number;
  ram_used: number;
  ram_usage_percent: number;
  ip_address: string;
}

// Custom TikTok icon component
interface TikTokIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const TikTokIcon = ({
  size = 24,
  color = 'currentColor',
  ...props
}: TikTokIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <path d='M15 9.9V4.1C15 4 15 4 14.9 4H12c0 .1 0 .1 0 .1v15.8c0 1.2-1.1 2.1-2.3 2-1-.1-1.7-.9-1.7-1.9 0-1.1.9-2 2-2 .1 0 .2 0 .3 0v-2.9h-.3c-2.9 0-5.2 2.4-5 5.3.2 2.5 2.2 4.5 4.7 4.7 2.8.2 5.3-2.1 5.3-5V9.9c1.6 1.1 3.4 1.9 5.3 1.9v-3c-2 .1-3.8-.8-5.3-2.3z' />
  </svg>
);

type TabKey = 'devices' | 'tiktok' | 'history' | 'settings';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  serverStatus?: 'running' | 'error' | 'starting';
}

const AppLayout = ({
  children,
  activeTab,
  onTabChange,
  serverStatus = 'starting',
}: AppLayoutProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Format RAM percentage to fixed decimal places
  const formatRamPercent = (value: number): string => {
    return value.toFixed(2);
  };

  // Fetch system info from the Rust backend
  const fetchSystemInfo = async () => {
    try {
      const info = await invoke<SystemInfo>('get_system_info');
      setSystemInfo(info);
    } catch (err) {
      console.error('Failed to fetch system info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch system info initially and then every 3 seconds
  useEffect(() => {
    fetchSystemInfo();

    const intervalId = setInterval(fetchSystemInfo, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update DOM and localStorage
    const root = window.document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className='flex h-screen bg-white dark:bg-[#0f172a] overflow-hidden'>
      {/* Left Sidebar */}
      <div className='w-[85px] bg-black dark:bg-[#071126] flex flex-col items-center py-4 text-white border-r dark:border-[#1e293b]'>
        <nav className='flex flex-col items-center space-y-6 flex-1'>
          <SidebarItem
            icon={<Smartphone size={24} />}
            label='Thiết bị'
            isActive={activeTab === 'devices'}
            onClick={() => onTabChange('devices')}
          />
          <SidebarItem
            icon={<TikTokIcon size={24} />}
            label='Tiktok'
            isActive={activeTab === 'tiktok'}
            onClick={() => onTabChange('tiktok')}
          />
          <SidebarItem
            icon={<History size={24} />}
            label='Lịch sử'
            isActive={activeTab === 'history'}
            onClick={() => onTabChange('history')}
          />
        </nav>

        <div className='mt-auto mb-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-[#1e293b]'
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='h-14 border-b dark:border-[#1e293b] bg-white dark:bg-[#0f172a] flex items-center justify-between px-4'>
          <div className='flex items-center'>
            <span className='text-lg font-medium text-gray-900 dark:text-white'>
              {activeTab === 'devices' && 'Thiết bị'}
              {activeTab === 'tiktok' && 'Tiktok'}
              {activeTab === 'history' && 'Lịch sử'}
              {activeTab === 'settings' && 'Cài đặt'}
            </span>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-4 bg-gray-100 dark:bg-[#1e293b] rounded-md px-3 py-1.5'>
              {isLoading ? (
                <span className='text-xs text-gray-700 dark:text-gray-300'>
                  Loading...
                </span>
              ) : systemInfo ? (
                <>
                  <span className='text-xs text-gray-700 dark:text-gray-300 min-w-[80px]'>
                    CPU: {systemInfo.cpu_usage.toFixed(2)}%
                  </span>
                  <span className='text-xs text-gray-700 dark:text-gray-300 min-w-[80px]'>
                    RAM: {formatRamPercent(systemInfo.ram_usage_percent)}%
                  </span>
                  <span className='text-xs text-gray-700 dark:text-gray-300 min-w-[100px]'>
                    IP: {systemInfo.ip_address}
                  </span>
                </>
              ) : (
                <span className='text-xs text-gray-700 dark:text-gray-300'>
                  No system info
                </span>
              )}
            </div>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => onTabChange('settings')}
              className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e293b]'
            >
              <Settings
                size={20}
                className={
                  activeTab === 'settings'
                    ? 'text-blue-600 dark:text-blue-400'
                    : ''
                }
              />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className='flex-1 overflow-auto bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white'>
          {children}
        </main>

        {/* Footer */}
        <footer className='h-8 border-t dark:border-[#1e293b] px-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#0f172a]'>
          <div>Version: 25.01.07 | Update: 12/03/2025</div>
          <div className='flex items-center'>
            <span
              className={`h-2 w-2 rounded-full mr-2 ${
                serverStatus === 'running' ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
            <span>
              {serverStatus === 'running' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, isActive, onClick }: SidebarItemProps) => {
  return (
    <button
      className={cn(
        'flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors',
        isActive
          ? 'bg-blue-600 dark:bg-blue-700 text-white'
          : 'text-white hover:bg-[#1e293b] hover:text-blue-400'
      )}
      onClick={onClick}
    >
      <div>{icon}</div>
      <span className='text-xs mt-1'>{label}</span>
    </button>
  );
};

export default AppLayout;
