# 補助金ファインダー

## プロジェクト概要

「補助金ファインダー」は、jGrants API及び東京都の補助金情報を収集し、簡易検索とマッチング機能を提供するWebアプリケーションです。個人事業主や中小企業が、自分たちに適した補助金をより簡単に見つけられるようにすることを目的としています。

![補助金ファインダーのスクリーンショット](screenshot.png)

## 主な機能

- **補助金情報の一元管理**: jGrantsと東京都の補助金情報を一括表示
- **キーワード検索**: タイトルや説明文からのキーワード検索
- **詳細フィルタリング**: 交付団体、対象者、募集状況などによるフィルタリング
- **マッチング機能**: 業種、地域、キーワードなどの条件に基づく最適な補助金のレコメンド
- **詳細情報表示**: 補助金の詳細情報と公式サイトへのリンク

## 技術スタック

### バックエンド
- **Python 3.9+**: モダンな言語機能を活用
- **FastAPI**: 高速なAPI開発フレームワーク
- **SQLModel**: ORMとPydanticを組み合わせた型安全なデータベース操作
- **SQLite**: 軽量データベース
- **httpx**: 非同期HTTP通信
- **Beautiful Soup 4**: Webスクレイピング
- **Loguru**: 高機能ログ管理

### フロントエンド
- **React**: モダンなUI構築
- **React Router**: クライアントサイドルーティング
- **Tailwind CSS**: 効率的なスタイリング
- **Axios**: APIとの通信

## セットアップ方法

### 前提条件
- Python 3.9+ がインストールされていること
- Node.js 16+ がインストールされていること

### バックエンド

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/subsidy-finder.git
cd subsidy-finder

# 仮想環境の作成と有効化（オプション）
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存パッケージのインストール
cd backend
pip install -r requirements.txt

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な設定を行う

# サーバーの起動
uvicorn app.main:app --reload
```

### フロントエンド

```bash
# 別のターミナルで
cd subsidy-finder/frontend

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## デプロイ方法

### Renderを使用したデプロイ

このプロジェクトは[Render](https://render.com/)を使用して簡単にデプロイできます。

1. Renderアカウントを作成
2. 「New Web Service」を選択
3. GitHubリポジトリを連携
4. 以下の設定を行う:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt && npm install --prefix frontend && npm run build --prefix frontend`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 環境変数を設定
6. デプロイボタンをクリック

## 開発の動機

このプロジェクトは、以下の目的で開発されました：

1. 中小企業や個人事業主が補助金情報にアクセスしやすくする
2. 複数の情報源から補助金データを一元的に管理する
3. 利用者に最適な補助金を素早く見つけられるようにする
4. 実用的なWebアプリケーション開発のポートフォリオとして活用する

## 今後の拡張予定

- 他の自治体のスクレイピング追加
- 補助金申請期限のアラート機能
- 条件マッチングのアルゴリズム改善
- ユーザーアカウント機能による補助金のお気に入り登録

## ライセンス

MITライセンス

## 作者

Your Name
