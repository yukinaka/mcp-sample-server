# MCP Sample Server

シンプルなModel Context Protocol (MCP)サーバーのサンプル実装です。

## 関連プロジェクト

- **MCPクライアント**: このサーバーと対話するための自然言語クライアント
  - OpenAI APIを使用して自然言語でMCPツールを実行
  - GitHubリポジトリ: [yukinaka/mcp-client](https://github.com/yukinaka/mcp-client)
  - ローカルパス: `../mcp-client/`

## 機能

このMCPサーバーは以下の機能を提供します：

### ツール

1. **get_current_time** - 現在の時刻を取得
   - パラメータ: `timezone` (オプション) - タイムゾーン（例: Asia/Tokyo, UTC）

2. **calculate** - 簡単な計算を実行
   - パラメータ:
     - `operation` - 演算の種類（add, subtract, multiply, divide）
     - `a` - 最初の数値
     - `b` - 2番目の数値

### リソース

- サンプルノートへのアクセス（`note:///welcome`, `note:///example`）

## インストール

### 前提条件

- Node.js (v18以上)
- npm または yarn

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/yukinaka/mcp-sample-server.git
cd mcp-sample-server

# 依存関係をインストール
npm install

# ビルド
npm run build
```

### npmパッケージとしてインストール（公開後）

```bash
npm install -g @odenalexbs/mcp-sample-server
```

## 使い方

### MCPクライアントで使用する（推奨）

このサーバーには、OpenAI APIを使用した自然言語クライアントが付属しています。

```bash
cd ../mcp-client
npm install
npm start
```

詳細は[mcp-client/README.md](../mcp-client/README.md)を参照してください。

### Claude Codeで使用する

`.claude/settings.local.json` に以下の設定を追加します：

#### 開発版（ローカル）を使用する場合

```json
{
  "mcpServers": {
    "sample": {
      "command": "node",
      "args": ["/path/to/mcp-sample-server/dist/index.js"]
    }
  }
}
```

#### GitHubから直接使用する場合

```json
{
  "mcpServers": {
    "sample": {
      "command": "npx",
      "args": ["-y", "github:yukinaka/mcp-sample-server"]
    }
  }
}
```

#### npmパッケージとして使用する場合（公開後）

```json
{
  "mcpServers": {
    "sample": {
      "command": "npx",
      "args": ["-y", "@odenalexbs/mcp-sample-server"]
    }
  }
}
```

### 他のMCPクライアントで使用する

Claude Desktop等の他のMCPクライアントでも同様に設定できます。クライアントの設定ファイルに上記のような設定を追加してください。

## 開発

### ウォッチモード

```bash
npm run watch
```

### テスト実行

```bash
# サーバーを直接実行してテスト
npm run build
npm start
```

## GitHub公開手順

1. GitHubで新しいリポジトリを作成
2. ローカルでGitリポジトリを初期化:

```bash
git init
git add .
git commit -m "Initial commit: MCP sample server"
git branch -M main
git remote add origin https://github.com/yukinaka/mcp-sample-server.git
git push -u origin main
```

3. （オプション）npmに公開:

```bash
npm login
npm publish
```

## カスタマイズ

このサンプルをベースに、独自のツールやリソースを追加できます：

- `src/index.ts` の `tools` 配列に新しいツールを追加
- `CallToolRequestSchema` ハンドラーに実装を追加
- リソースを追加する場合は `resources` 関連のハンドラーを修正

## ライセンス

MIT

## 参考リンク

- [MCP公式ドキュメント](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
