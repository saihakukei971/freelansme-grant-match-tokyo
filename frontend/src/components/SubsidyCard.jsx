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
    <div className="card p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-blue-800 truncate">
          {subsidy.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-bold rounded ${
          subsidy.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {subsidy.is_active ? '募集中' : '終了'}
        </span>
      </div>

      <div className="mb-2 text-sm text-gray-600">
        <div><span className="font-semibold">交付団体:</span> {subsidy.organization}</div>
        <div><span className="font-semibold">対象者:</span> {subsidy.target}</div>
        {subsidy.amount && <div><span className="font-semibold">金額/補助率:</span> {subsidy.amount}</div>}
      </div>

      {subsidy.application_end && (
        <div className="mb-2 text-sm">
          <span className="font-semibold">募集期限:</span>
          <span className={subsidy.is_active ? 'text-gray-700' : 'text-red-600'}>
            {formatDate(subsidy.application_end)}
          </span>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-600">
        <p className="line-clamp-2">{subsidy.description || '説明なし'}</p>
      </div>

      <div className="flex justify-between items-center">
        <Link
          to={`/subsidies/${subsidy.id}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          詳細を見る →
        </Link>

        <a
          href={subsidy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          公式サイト ↗
        </a>
      </div>
    </div>
  );
};

export default SubsidyCard;