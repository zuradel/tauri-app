import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Device {
  id: number;
  name: string;
  model: string;
  os: string;
  xu: number;
  status: string;
  isConnected: boolean;
}

const DevicesView = () => {
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  // Mock data
  const devices: Device[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `SM-G950F`,
    model: `SM-G950F`,
    os: '9',
    xu: 0,
    status: `Change info thành công: ${
      ['asus', 'xiaomi', 'samsung', 'realme', 'kyocera'][
        Math.floor(Math.random() * 5)
      ]
    }/...`,
    isConnected: true,
  }));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map((device) => device.id));
    }
    setAllSelected(!allSelected);
  };

  const handleSelectDevice = (id: number) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(selectedDevices.filter((deviceId) => deviceId !== id));
      setAllSelected(false);
    } else {
      setSelectedDevices([...selectedDevices, id]);
      if (selectedDevices.length + 1 === devices.length) {
        setAllSelected(true);
      }
    }
  };

  return (
    <div className='flex h-full'>
      {/* Main Table */}
      <div className='flex-1 overflow-auto p-4'>
        <div className='bg-white dark:bg-[#0f172a] rounded-md border dark:border-[#1e293b] overflow-hidden shadow-sm'>
          <Table>
            <TableHeader>
              <tr className='bg-gray-50 dark:bg-[#1e293b] text-left'>
                <TableHead className='w-12 p-2'>
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label='Select all devices'
                  />
                </TableHead>
                <TableHead className='w-12 p-2'>#</TableHead>
                <TableHead className='w-12 p-2'>Live</TableHead>
                <TableHead className='w-24 p-2'>Id</TableHead>
                <TableHead className='w-32 p-2'>Name</TableHead>
                <TableHead className='w-16 p-2'>OS</TableHead>
                <TableHead className='w-16 p-2'>Xu</TableHead>
                <TableHead className='p-2'>Status</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow
                  key={device.id}
                  className={`${
                    device.id === 11
                      ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      : ''
                  }`}
                >
                  <TableCell className='p-2'>
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => handleSelectDevice(device.id)}
                      aria-label={`Select device ${device.id}`}
                    />
                  </TableCell>
                  <TableCell className='p-2'>{device.id}</TableCell>
                  <TableCell className='p-2'>
                    <div
                      className={`h-4 w-4 rounded-full ${
                        device.isConnected ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                  </TableCell>
                  <TableCell className='p-2'>{device.model}</TableCell>
                  <TableCell className='p-2'>{device.name}</TableCell>
                  <TableCell className='p-2'>{device.os}</TableCell>
                  <TableCell className='p-2'>{device.xu}</TableCell>
                  <TableCell className='p-2 text-green-600 dark:text-green-400'>
                    {device.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
          Đã chọn: {selectedDevices.length} | Kết nối:{' '}
          {devices.filter((d) => d.isConnected).length} | Tất cả:{' '}
          {devices.length}
        </div>
      </div>

      {/* Right Control Panel */}
      <div className='w-[320px] border-l dark:border-[#1e293b] p-4 overflow-auto'>
        <div className='space-y-6'>
          {/* Search */}
          <div>
            <Input placeholder='Tìm kiếm' className='mb-2' />
            <div className='grid grid-cols-2 gap-2'>
              <Button className='bg-green-500 hover:bg-green-600'>
                Load List Device
              </Button>
              <Button variant='destructive'>Restart ReLoad</Button>
            </div>
          </div>

          {/* Phone Settings */}
          <Card className='dark:bg-[#1e293b] dark:border-[#334155]'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm'>Cài đặt phone</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='defaultSettings' />
                  <label htmlFor='defaultSettings' className='text-xs'>
                    Cài đặt ban đầu
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='english' />
                  <label htmlFor='english' className='text-xs'>
                    Cài ngôn ngữ English
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='gps' />
                  <label htmlFor='gps' className='text-xs'>
                    Tắt GPS
                  </label>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox id='restart' />
                  <label htmlFor='restart' className='text-xs'>
                    Khởi động lại máy
                  </label>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2 mt-4'>
                <Button className='bg-blue-500 hover:bg-blue-600'>
                  Bắt đầu
                </Button>
                <Button className='bg-green-500 hover:bg-green-600'>
                  Kết nối
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Device ID Update */}
          <div>
            <p className='text-sm font-medium mb-2'>Cập nhật tên</p>
            <div className='space-y-2'>
              <div className='grid grid-cols-[80px_1fr] items-center gap-2'>
                <span className='text-sm'>Id</span>
                <Input defaultValue='10.3.15.131:5555' />
              </div>
              <div className='grid grid-cols-[80px_1fr] items-center gap-2'>
                <span className='text-sm'>Name</span>
                <Input defaultValue='SM-G950F' />
              </div>
              <div className='grid grid-cols-2 gap-2 mt-2'>
                <Button variant='outline'>Auto Index</Button>
                <Button variant='outline'>Update</Button>
              </div>
            </div>
          </div>

          {/* Test Functions */}
          <div>
            <p className='text-sm font-medium mb-2'>Test change</p>
            <div className='grid grid-cols-2 gap-2'>
              <Button variant='outline'>Info Device</Button>
              <Button variant='outline'>Change 4G</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicesView;
