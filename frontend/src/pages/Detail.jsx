import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubsidyDetail } from '../api';

const Detail = () => {
  const { id } = useParams();
  const [subsidy, setSubsidy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubsidyDetail = async () => {
      try {
        setLoading(true);
        const data = await getSubsidyDetail(id);
        setSubsidy(data);
        setError(null);
      } catch (err) {
        console.error('補助金詳細の取得に失敗:', err);
        setError('補助金の詳細情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidyDetail();
  }, [id]);

  // 期限表示用の日付フォーマッタ
  const formatDate = (dateString) => {
    if (!dateString) return '未設定';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}年${month}月${day}日`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          ← 検索ページに戻る
        </Link>
      </div>
    );
  }

  if (!subsidy) {
    return (
      <div className="bg-yellow-100 p-4 rounded-lg">
        <p className="text-yellow-800">補助金情報が見つかりませんでした。</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          ← 検索ページに戻る
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-block mb-6 text-blue-600 hover:text-blue-800">
        ← 検索ページに戻る
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{subsidy.title}</h1>
          <span className={`px-3 py-1 text-sm font-bold rounded ${
            subsidy.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {subsidy.is_active ? '募集中' : '終了'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">基本情報</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <th className="py-2 pr-4 text-left text-gray-600 align-top">交付団体</th>
                  <td className="py-2">{subsidy.organization}</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 text-left text-gray-600 align-top">対象者</th>
                  <td className="py-2">{subsidy.target}</td>
                </tr>
                {subsidy.amount && (
                  <tr>
                    <th className="py-2 pr-4 text-left text-gray-600 align-top">金額/補助率</th>
                    <td className="py-2">{subsidy.amount}</td>
                  </tr>
                )}
                <tr>
                  <th className="py-2 pr-4 text-left text-gray-600 align-top">募集開始</th>
                  <td className="py-2">
                    {subsidy.application_start ? formatDate(subsidy.application_start) : '未設定'}
                  </td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 text-left text-gray-600 align-top">募集終了</th>
                  <td className="py-2">
                    {subsidy.application_end ? formatDate(subsidy.application_end) : '未設定'}
                  </td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 text-left text-gray-600 align-top">情報源</th>
                  <td className="py-2">
                    {subsidy.source === 'jgrants' ? 'jGrants' : '東京都ウェブサイト'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">補助金の概要</h2>
            <div className="prose max-w-none">
              {subsidy.description ? (
                <p className="text-gray-700 whitespace-pre-line">{subsidy.description}</p>
              ) : (
                <p className="text-gray-500 italic">詳細な説明はありません。公式サイトをご確認ください。</p>
              )}
            </div>

            {subsidy.keywords && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">キーワード</h3>
                <div className="flex flex-wrap gap-2">
                  {subsidy.keywords.split(',').map((keyword, index) =>
                    keyword.trim() && (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {keyword.trim()}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <a
            href={subsidy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center"
          >
            公式サイトで詳細を確認
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Detail;