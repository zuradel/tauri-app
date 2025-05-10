import { atom, useAtom } from 'jotai';
import { useWebSocket } from '@/components/WebSocketProvider';
import { useCallback, useEffect } from 'react';

interface Device {
  id: number;
  name: string;
  model: string;
  os: string;
  xu: number;
  status: string;
  isConnected: boolean;
  isSelected: boolean;
}
export const devicesAtom = atom<Device[]>(
  Array.from({ length: 25 }, (_, i) => ({
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
    isSelected: false,
  }))
);

export const useDevices = () => {
  const [devices, setDevices] = useAtom(devicesAtom);
  const { wsConnected, sendMessage, wsResponse } = useWebSocket();

  useEffect(() => {
    if (wsResponse) {
      console.log({ wsResponse });
    }
  }, [wsResponse]);

  const handleSelectAll = useCallback(() => {
    setDevices(
      devices.map((device) => ({
        ...device,
        isSelected: !devices.every((d) => d.isSelected),
      }))
    );
  }, [devices, setDevices]);

  const handleSelectDevice = useCallback(
    (id: number) => {
      setDevices(
        devices.map((device) =>
          device.id === id
            ? { ...device, isSelected: !device.isSelected }
            : device
        )
      );
    },
    [devices, setDevices]
  );

  const handleLoadDevices = useCallback(() => {
    if (wsConnected) {
      sendMessage('devices');
    } else {
      console.error('WebSocket not connected');
    }
  }, [wsConnected, sendMessage]);

  return {
    devices,
    setDevices,
    handleSelectDevice,
    handleSelectAll,
    handleLoadDevices,
    allSelected: devices.every((device) => device.isSelected),
    isConnected: wsConnected,
  };
};
