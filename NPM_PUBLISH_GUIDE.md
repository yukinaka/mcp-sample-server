# npmへの自動公開ガイド

このプロジェクトはGitHub Actionsを使用してnpmに自動公開されます。

## 初回セットアップ

### 1. npmアクセストークンの作成

1. https://www.npmjs.com/ にログイン
2. 右上のプロフィールアイコン → **Access Tokens**
3. **Generate New Token** → **Classic Token**
4. トークン名を入力（例: `mcp-sample-server-github-actions`）
5. **Automation**を選択（読み取り/書き込み権限）
6. **Generate Token**をクリック
7. 表示されたトークンをコピー（一度しか表示されません！）

### 2. GitHub Secretsにトークンを追加

1. GitHubリポジトリ https://github.com/yukinaka/mcp-sample-server にアクセス
2. **Settings** タブをクリック
3. 左サイドバーの **Secrets and variables** → **Actions**
4. **New repository secret**をクリック
5. 以下を入力：
   - **Name**: `NPM_TOKEN`
   - **Secret**: コピーしたnpmトークン
6. **Add secret**をクリック

## 公開方法

### バージョンタグをプッシュするだけ

```bash
# 1. バージョンを更新（package.jsonのversionを変更）
npm version patch  # パッチバージョンアップ (1.0.0 → 1.0.1)
# または
npm version minor  # マイナーバージョンアップ (1.0.0 → 1.1.0)
# または
npm version major  # メジャーバージョンアップ (1.0.0 → 2.0.0)

# 2. タグをGitHubにプッシュ
git push --follow-tags
```

これだけで、GitHub Actionsが自動的に：
1. コードをビルド
2. npmに公開

を実行します。

## 公開の確認

1. GitHubリポジトリの**Actions**タブで進捗を確認
2. 完了後、https://www.npmjs.com/package/mcp-sample-server で確認

## 手動公開（必要な場合のみ）

もしGitHub Actionsを使わずに手動で公開したい場合：

```bash
npm login
npm publish
```

## トラブルシューティング

### GitHub Actionsが失敗する場合

1. `NPM_TOKEN`が正しく設定されているか確認
2. トークンの有効期限が切れていないか確認
3. package.jsonのnameが既存のパッケージと重複していないか確認

### パッケージ名が既に使われている場合

package.jsonのnameを変更してください：

```json
{
  "name": "@yourusername/mcp-sample-server",
  ...
}
```

スコープ付きパッケージ（`@username/package`）を使う場合、npmで公開する際に`--access public`が必要です：

```bash
npm publish --access public
```

または、GitHub Actionsのワークフローを更新：

```yaml
- name: Publish to npm
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```
