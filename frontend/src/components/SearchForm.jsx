import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [organization, setOrganization] = useState('');
  const [target, setTarget] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      q: keyword,
      organization,
      target,
      activeOnly
    });
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl font-bold mb-4">補助金を検索</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-medium">キーワード</label>
          <input
            type="text"
            className="input"
            placeholder="キーワードで検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-medium">交付団体</label>
          <select
            className="select"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          >
            <option value="">すべて</option>
            <option value="国">国</option>
            <option value="東京都">東京都</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-medium">対象者</label>
          <select
            className="select"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="">すべて</option>
            <option value="中小企業">中小企業</option>
            <option value="個人事業主">個人事業主</option>
            <option value="NPO">NPO</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            <span className="text-gray-700">募集中のみ表示</span>
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          検索
        </button>
      </form>
    </div>
  );
};

export default SearchForm;