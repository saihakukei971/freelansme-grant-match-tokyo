import axios from 'axios';

// APIクライアントの設定
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // タイムアウト設定を追加
  timeout: 10000,
});

// エラーハンドリングのインターセプター
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// 補助金一覧を取得
export const getSubsidies = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get(`/subsidies?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('補助金一覧の取得に失敗:', error);
    throw error;
  }
};

// 補助金詳細を取得
export const getSubsidyDetail = async (id) => {
  try {
    const response = await apiClient.get(`/subsidies/${id}`);
    return response.data;
  } catch (error) {
    console.error('補助金詳細の取得に失敗:', error);
    throw error;
  }
};

// 補助金を検索
export const searchSubsidies = async (params) => {
  try {
    // URLクエリパラメータを構築
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.organization) queryParams.append('organization', params.organization);
    if (params.target) queryParams.append('target', params.target);
    if (params.activeOnly !== undefined) queryParams.append('active_only', params.activeOnly);
    
    const response = await apiClient.get(`/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('補助金検索に失敗:', error);
    throw error;
  }
};

// 補助金マッチング
export const matchSubsidies = async (params) => {
  try {
    // URLクエリパラメータを構築
    const queryParams = new URLSearchParams();
    
    if (params.businessType) queryParams.append('business_type', params.businessType);
    if (params.prefecture) queryParams.append('prefecture', params.prefecture);
    if (params.targetType) queryParams.append('target_type', params.targetType);
    if (params.keywords) queryParams.append('keywords', params.keywords);
    
    const response = await apiClient.get(`/match?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('補助金マッチングに失敗:', error);
    throw error;
  }
};

// 補助金統計情報を取得
export const getSubsidyStats = async () => {
  try {
    const response = await apiClient.get('/stats');
    return response.data;
  } catch (error) {
    console.error('補助金統計情報の取得に失敗:', error);
    throw error;
  }
};
