# ConsoleTranslate
## 概要
コマンドライン上で使える翻訳ツール <br>
node.js上で動作 <br>
翻訳にはOpenAIのAPIとGoogle翻訳が利用できます <br>
```bash
$ ctrans ja "Hello World"
> ---------------------------------------------------------------------
> こんにちは、世界
> ---------------------------------------------------------------------
```

## 使い方
```bash
# 翻訳先の言語を指定して翻訳
ctrans ja "I am kamesan."

# パイプライン経由でも翻訳可能
echo "I am kamesan." | ctrans stdin ja

# OpenAIを利用する場合は-mオプションでGPTのバージョンを指定可能
ctrans ja "I am kamsean." -m gpt4

# 　利用する翻訳ツールを選択可能
ctrans ja "I use google." -p google
```
現時点では以下の言語への翻訳に対応(その気になればどんな言語でも対応できるけど)
```
    "en": "English",
    "ja": "Japanese",
    "cn": "Chinese", //OpenAIのみ
    "eo": "Esperanto",
    "tok": "Toki Pona" //OpenAIのみ
```
## インストール(Ubuntu22.04環境で確認)
1. ダウンロードしたリポジトリに移動
2. 依存関係のインストール
```bash
$ npm i
```
3. ビルド
```bash
$ npm run build
```
5. ビルドしたアプリをグローバルにインストール
```bash
$ npm i -g .
```
6. APIキーの登録
```bash
// OpenAIを使う場合
// ※あらかじめhttps://platform.openai.com/ でOpenAIのAPIキーを発行しておいてください
$ ctrans set-openai-api-key <APIキー>

// Google翻訳を使う場合
// ※あらかじめGoogle CloudでCloudTranslationの APIが使えるAPIキーを発行しておいてください
$ ctrans set-google-api-key <APIキー>
```
7. デフォルトの翻訳ツールを設定する
```bash
// 特に設定しないとopenaiが利用されます
$ ctrans set-default-provider <openai | google>
```
8. つかってみる
```bash
$ ctrans ja "Hello World"
# 以下のような表示が出たら成功!
> ---------------------------------------------------------------------
> こんにちは、世界
> ---------------------------------------------------------------------
```
## 注意点
- 利用しているnode.jsのバージョンによっては実行時に警告が表示されますが、動作には問題ありません(多分)
- 翻訳にOpenAI APIを利用しているため入力された文章が長すぎる場合には全文翻訳を行わず、要約された文章を返します
   - ドキュメントや長文のエラーを翻訳する場合は注意してください
