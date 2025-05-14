import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import SubsidyCard from '../components/SubsidyCard';
import { searchSubsidies, matchSubsidies, getSubsidyStats } from '../api';

const Home = () => {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchMode, setSearchMode] = useState('search'); // 'search' or 'match'

  // マッチング検索用の状態
  const [businessType, setBusinessType] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [targetType, setTargetType] = useState('');
  const [keywords, setKeywords] = useState('');

  // 初期ロード時に最新の補助金を取得
  useEffect(() => {
    fetchInitialData();
    fetchStats();
  }, []);

  // 統計情報を取得
  const fetchStats = async () => {
    try {
      const data = await getSubsidyStats();
      setStats(data);
    } catch (err) {
      console.error('統計情報の取得に失敗:', err);
    }
  };

  // 初期データを取得
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 募集中の補助金を取得
      const result = await searchSubsidies({ activeOnly: true });
      setSubsidies(result);
    } catch (err) {
      console.error('補助金情報の取得に失敗:', err);
      setError('補助金情報の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 検索実行
  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);

      const result = await searchSubsidies(searchParams);
      setSubsidies(result);
    } catch (err) {
      console.error('検索に失敗:', err);
      setError('検索に失敗しました。後でもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // マッチング実行
  const handleMatch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const result = await matchSubsidies({
        businessType,
        prefecture,
        targetType,
        keywords
      });

      if (result.matches && result.matches.length > 0) {
        // マッチング結果の詳細情報を取得
        const detailedMatches = await Promise.all(
          result.matches.map(match =>
            searchSubsidies({ id: match.id })
              .then(data => data[0] ? { ...data[0], score: match.score } : null)
          )
        );

        // nullを除外
        const validMatches = detailedMatches.filter(match => match !== null);

        // スコア順にソート
        validMatches.sort((a, b) => b.score - a.score);

        setSubsidies(validMatches);
      } else {
        setSubsidies([]);
      }
    } catch (err) {
      console.error('マッチングに失敗:', err);
      setError('マッチングに失敗しました。後でもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 検索モードの切り替え
  const toggleSearchMode = (mode) => {
    setSearchMode(mode);
  };

  return (
    <div>
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">補助金を簡単に見つける</h1>
        <p className="text-gray-700 mb-2">
          jGrantsや東京都の補助金情報を簡単に検索・マッチングできます。
          あなたの事業や目的に合った補助金を見つけましょう。
        </p>

        {stats && (
          <div className="bg-white rounded p-3 mt-3 text-sm inline-block">
            <span className="font-semibold">現在の登録補助金: </span>
            <span className="text-blue-600 font-bold">{stats.total_count}件</span>
            <span className="mx-2">|</span>
            <span className="font-semibold">募集中: </span>
            <span className="text-green-600 font-bold">{stats.active_count}件</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左サイドバー - 検索/マッチングフォーム */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  searchMode === 'search'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => toggleSearchMode('search')}
              >
                キーワード検索
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  searchMode === 'match'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => toggleSearchMode('match')}
              >
                条件マッチング
              </button>
            </div>
          </div>

          {searchMode === 'search' ? (
            <SearchForm onSearch={handleSearch} />
          ) : (
            <div className="card p-4">
              <h2 className="text-xl font-bold mb-4">条件でマッチング</h2>

              <form onSubmit={handleMatch}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 text-sm font-medium">業種</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="例: IT、製造、小売"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 text-sm font-medium">地域</label>
                  <select
                    className="select"
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    <option value="東京都">東京都</option>
                    <option value="全国">全国</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 text-sm font-medium">事業形態</label>
                  <select
                    className="select"
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    <option value="中小企業">中小企業</option>
                    <option value="個人事業主">個人事業主</option>
                    <option value="NPO">NPO法人</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 text-sm font-medium">キーワード</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="カンマ区切りで複数入力可"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">例: 創業,デジタル化,販路開拓</p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  マッチングする
                </button>
              </form>
            </div>
          )}
        </div>

        {/* メインコンテンツ - 補助金リスト */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          ) : subsidies.length === 0 ? (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">検索結果がありません</h3>
              <p className="text-yellow-700">
                検索条件を変更して、再度お試しください。
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">
                検索結果: {subsidies.length}件
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {subsidies.map((subsidy) => (
                  <SubsidyCard key={subsidy.id} subsidy={subsidy} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;