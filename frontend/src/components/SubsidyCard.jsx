import React from 'react';
import { Link } from 'react-router-dom';

const SubsidyCard = ({ subsidy }) => {
  // 期限表示用の日付フォーマッタ
  const formatDate = (dateString) => {
    if (!dateString) return '未設定';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
  };

  return (
    <div className="card p-5 fade-in">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-blue-800 truncate">
          {subsidy.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
          subsidy.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {subsidy.is_active ? '募集中' : '終了'}
        </span>
      </div>
      
      <div className="mb-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
        <div><span className="font-semibold">交付団体:</span> {subsidy.organization}</div>
        <div><span className="font-semibold">対象者:</span> {subsidy.target}</div>
        {subsidy.amount && <div className="col-span-2"><span className="font-semibold">金額/補助率:</span> {subsidy.amount}</div>}
      </div>
      
      {subsidy.application_end && (
        <div className="mb-3 text-sm">
          <span className="font-semibold">募集期限:</span> 
          <span className={subsidy.is_active ? 'text-gray-700' : 'text-red-600'}>
            {formatDate(subsidy.application_end)}
          </span>
        </div>
      )}
      
      <div className="mb-4 text-sm text-gray-600 border-t border-b border-gray-100 py-2 my-2">
        <p className="line-clamp-2">{subsidy.description || '説明なし'}</p>
      </div>
      
      <div className="flex justify-between items-center mt-auto">
        <Link
          to={`/subsidies/${subsidy.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          詳細を見る
        </Link>
        
        
          href={subsidy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          公式サイト
        </a>
      </div>
    </div>
  );
};

export default SubsidyCard;
