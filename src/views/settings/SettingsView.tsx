import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { invoke } from '@tauri-apps/api/core';
import {
  Cpu,
  Database,
  HardDrive,
  Network,
  Power,
  RefreshCw,
  Save,
  Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Define the SystemInfo interface to match the Rust struct
interface SystemInfo {
  cpu_usage: number;
  ram_total: number;
  ram_used: number;
  ram_usage_percent: number;
  ip_address: string;
}

// Create a component for system monitoring
const SystemMonitoring = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format bytes to a human-readable format (MB or GB)
  const formatBytes = (bytes: number): string => {
    const megabytes = bytes / (1024 * 1024);
    if (megabytes < 1024) {
      return `${megabytes.toFixed(2)} MB`;
    } else {
      const gigabytes = megabytes / 1024;
      return `${gigabytes.toFixed(2)} GB`;
    }
  };

  // Fetch system info from the Rust backend
  const fetchSystemInfo = async () => {
    try {
      const info = await invoke<SystemInfo>('get_system_info');
      setSystemInfo(info);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch system info:', err);
      setError('Failed to fetch system information');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch system info initially and then every 2 seconds
  useEffect(() => {
    fetchSystemInfo();

    // Set up an interval to update the system info every 2 seconds
    const intervalId = setInterval(fetchSystemInfo, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center p-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        ) : error ? (
          <div className='text-red-500 p-2 text-center'>{error}</div>
        ) : systemInfo ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Cpu className='h-5 w-5 mr-2 text-blue-500' />
                <span className='font-medium'>CPU Usage</span>
              </div>
              <div className='text-right'>
                <span className='font-mono'>
                  {systemInfo.cpu_usage.toFixed(1)}%
                </span>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1'>
                  <div
                    className='bg-blue-500 h-2.5 rounded-full'
                    style={{ width: `${Math.min(systemInfo.cpu_usage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <HardDrive className='h-5 w-5 mr-2 text-green-500' />
                <span className='font-medium'>RAM Usage</span>
              </div>
              <div className='text-right'>
                <span className='font-mono'>
                  {formatBytes(systemInfo.ram_used)} /{' '}
                  {formatBytes(systemInfo.ram_total)} (
                  {systemInfo.ram_usage_percent.toFixed(1)}%)
                </span>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1'>
                  <div
                    className='bg-green-500 h-2.5 rounded-full'
                    style={{
                      width: `${Math.min(systemInfo.ram_usage_percent, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between mt-4'>
              <div className='flex items-center'>
                <Wifi className='h-5 w-5 mr-2 text-purple-500' />
                <span className='font-medium'>IP Address</span>
              </div>
              <span className='font-mono'>{systemInfo.ip_address}</span>
            </div>

            <Button
              variant='outline'
              className='w-full mt-2'
              onClick={fetchSystemInfo}
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh
            </Button>
          </div>
        ) : (
          <div className='text-center p-4'>No system information available</div>
        )}
      </CardContent>
    </Card>
  );
};

const SettingsView = () => {
  return (
    <div className='p-4 h-full flex flex-col'>
      <Tabs defaultValue='general' className='w-full h-full flex flex-col'>
        <TabsList className='w-full justify-start border-b px-0 rounded-none bg-transparent h-auto'>
          <TabsTrigger
            value='general'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10'
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value='connection'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10'
          >
            Connection
          </TabsTrigger>
          <TabsTrigger
            value='proxy'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10'
          >
            Proxy
          </TabsTrigger>
          <TabsTrigger
            value='advanced'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10'
          >
            Advanced
          </TabsTrigger>
          <TabsTrigger
            value='about'
            className='data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none h-10'
          >
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='flex-1 mt-4 overflow-auto'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Application Theme
                    </label>
                    <div className='flex space-x-2'>
                      <Button variant='outline' className='flex-1'>
                        Light
                      </Button>
                      <Button variant='outline' className='flex-1'>
                        Dark
                      </Button>
                      <Button variant='outline' className='flex-1'>
                        System
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Language</label>
                    <select className='w-full p-2 border rounded-md'>
                      <option>English</option>
                      <option>Vietnamese</option>
                    </select>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='notifications' />
                    <label htmlFor='notifications'>Enable notifications</label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='updates' />
                    <label htmlFor='updates'>
                      Check for updates automatically
                    </label>
                  </div>

                  <Button
                    className='w-full mt-2'
                    onClick={() => alert('Settings saved')}
                  >
                    <Save className='h-4 w-4 mr-2' />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Max Concurrent Devices
                    </label>
                    <Input type='number' defaultValue='10' />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Connection Timeout (seconds)
                    </label>
                    <Input type='number' defaultValue='30' />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Resource Limits
                    </label>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs'>CPU (%)</label>
                        <Input type='number' defaultValue='80' />
                      </div>
                      <div>
                        <label className='text-xs'>RAM (MB)</label>
                        <Input type='number' defaultValue='2048' />
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='resourceMonitoring' />
                    <label htmlFor='resourceMonitoring'>
                      Enable resource monitoring
                    </label>
                  </div>

                  <Button className='w-full mt-2' variant='outline'>
                    <RefreshCw className='h-4 w-4 mr-2' />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='connection' className='flex-1 mt-4 overflow-auto'>
          <div className='grid gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>ADB Path</label>
                    <div className='flex space-x-2'>
                      <Input
                        defaultValue='/usr/local/bin/adb'
                        className='flex-1'
                      />
                      <Button variant='outline'>Browse</Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Appium Server</label>
                    <Input defaultValue='http://localhost:4723' />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Connection Mode
                    </label>
                    <div className='flex space-x-2'>
                      <Button variant='outline' className='flex-1'>
                        Wireless
                      </Button>
                      <Button variant='outline' className='flex-1'>
                        USB
                      </Button>
                      <Button variant='outline' className='flex-1'>
                        Both
                      </Button>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='autoReconnect' />
                    <label htmlFor='autoReconnect'>
                      Automatically reconnect lost devices
                    </label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='saveDevices' />
                    <label htmlFor='saveDevices'>
                      Save device list between sessions
                    </label>
                  </div>

                  <Button className='w-full mt-2 bg-blue-500 hover:bg-blue-600'>
                    <Network className='h-4 w-4 mr-2' />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='proxy' className='flex-1 mt-4 overflow-auto'>
          <div className='grid gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Proxy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-2 mb-4'>
                    <Checkbox id='enableProxy' />
                    <label htmlFor='enableProxy' className='font-medium'>
                      Enable Proxy
                    </label>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm'>Proxy Type</label>
                      <select className='w-full p-2 border rounded-md'>
                        <option>HTTP</option>
                        <option>SOCKS5</option>
                        <option>SOCKS4</option>
                      </select>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm'>
                        Rotation Interval (minutes)
                      </label>
                      <Input type='number' defaultValue='30' />
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    <div className='space-y-2 col-span-2'>
                      <label className='text-sm'>Proxy Host</label>
                      <Input defaultValue='proxy.example.com' />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm'>Port</label>
                      <Input defaultValue='8080' />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm'>Username</label>
                      <Input defaultValue='proxyuser' />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm'>Password</label>
                      <Input type='password' defaultValue='password' />
                    </div>
                  </div>

                  <div className='pt-2'>
                    <Button className='w-full' variant='outline'>
                      <Database className='h-4 w-4 mr-2' />
                      Import Proxy List
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='advanced' className='flex-1 mt-4 overflow-auto'>
          <div className='grid gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='border p-3 rounded bg-yellow-50 text-yellow-800 mb-4'>
                    <p className='text-sm'>
                      Warning: These settings are for advanced users. Incorrect
                      values may cause system instability.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Debug Level</label>
                    <select className='w-full p-2 border rounded-md'>
                      <option>Off</option>
                      <option>Error</option>
                      <option>Warning</option>
                      <option>Info</option>
                      <option>Debug</option>
                      <option>Verbose</option>
                    </select>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Log File Path</label>
                    <div className='flex space-x-2'>
                      <Input defaultValue='./logs/app.log' className='flex-1' />
                      <Button variant='outline'>Browse</Button>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='logRotation' />
                    <label htmlFor='logRotation'>Enable log rotation</label>
                  </div>

                  <div className='pt-4 border-t'>
                    <h3 className='text-sm font-medium mb-2'>Danger Zone</h3>
                    <div className='space-y-2'>
                      <Button className='w-full' variant='outline'>
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Reset All Settings
                      </Button>

                      <Button
                        className='w-full text-red-500 border-red-300 hover:bg-red-50'
                        variant='outline'
                      >
                        <Power className='h-4 w-4 mr-2' />
                        Factory Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='about' className='flex-1 mt-4 overflow-auto'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>About Application</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-bold'>Phone Farm Manager</h3>
                    <p className='text-sm text-muted-foreground'>
                      Version 1.0.0
                    </p>
                  </div>

                  <div>
                    <h4 className='font-medium'>Built with</h4>
                    <ul className='text-sm pl-5 list-disc mt-1'>
                      <li>Tauri</li>
                      <li>React</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>shadcn/ui</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className='font-medium'>Support</h4>
                    <p className='text-sm mt-1'>
                      For support, please contact support@example.com
                    </p>
                  </div>

                  <Button className='w-full mt-4' variant='outline'>
                    Check for Updates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <SystemMonitoring />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsView;
