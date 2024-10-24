
import { useGlobalState } from '@/app/contexts/global-state';
import React from 'react';

const GlobalLoadingIndicator: React.FC = () => {
  const { isLoading } = useGlobalState();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[99999]">
      <div className=" flex justify-center items-center gap-3 px-5 py-3 bg-zinc-600 rounded border-1 border-[#222222c4]">
        <p className="text-xl text-white">Loading</p>
      <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
  );
};

export default GlobalLoadingIndicator;