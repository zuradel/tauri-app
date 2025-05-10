import React from 'react';
import { Button } from './ui/button';

interface LoadingScreenProps {
  onComplete: () => void;
  error: string | null;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, error }) => {
  return (
    <div className='fixed inset-0 bg-background flex flex-col items-center justify-center gap-4 p-4'>
      <h2 className='text-2xl font-bold text-center'>
        Đang kết nối đến API Server
      </h2>

      {error ? (
        <>
          <div className='text-red-500 text-center max-w-md'>
            <p className='text-lg font-semibold mb-2'>Lỗi kết nối server:</p>
            <p className='bg-red-50 p-3 rounded-md text-sm break-words'>
              {error}
            </p>
          </div>
          <Button onClick={onComplete} className='mt-4 px-6'>
            Tiếp tục vào ứng dụng
          </Button>
        </>
      ) : (
        <>
          <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-muted-foreground text-center'>
            Đang kết nối đến server, vui lòng đợi...
          </p>
        </>
      )}
    </div>
  );
};

export default LoadingScreen;
