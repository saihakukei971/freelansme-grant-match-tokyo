import React, { useState, useEffect } from 'react';

const InteractiveFeature = () => {
  const [count, setCount] = useState(0);
  const [animation, setAnimation] = useState('');
  
  // React Hooksの活用をアピール
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimation('');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [count]);
  
  const handleClick = () => {
    setCount(count + 1);
    setAnimation('animate-pulse');
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md mt-4 transition-all duration-300">
      <h3 className="text-lg font-bold mb-2">React機能デモ</h3>
      <p className="mb-2">このコンポーネントはReactの状態管理とエフェクトフックを活用しています</p>
      
      <div className={`flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-2 ${animation}`}>
        <span className="text-2xl font-bold">{count}</span>
      </div>
      
      <button 
        onClick={handleClick}
        className="btn btn-primary w-full"
      >
        カウントアップ (React useState デモ)
      </button>
      
      <div className="text-xs text-gray-500 mt-2">
        このインタラクティブな要素はReactの useState と useEffect フックで実装
      </div>
    </div>
  );
};

export default InteractiveFeature;