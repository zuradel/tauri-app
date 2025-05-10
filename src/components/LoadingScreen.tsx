import React from 'react';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  error?: string | null;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, error }) => {
  return (
    <div className='fixed inset-0 bg-background flex flex-col items-center justify-center gap-4 p-4'>
      <h2 className='text-2xl font-bold text-center'>
        Đang kết nối đến API Server
      </h2>

      {error ? (
        <>
          <div className='flex items-center gap-2 text-destructive mb-2'>
            <AlertCircle className='h-5 w-5' />
            <span>Lỗi kết nối</span>
          </div>
          <p className='text-muted-foreground text-center max-w-md mb-4'>
            {error}
          </p>
          {onComplete && (
            <Button onClick={onComplete}>
              Tiếp tục sử dụng không có kết nối
            </Button>
          )}
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
