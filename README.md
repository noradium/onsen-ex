# onsen-ex
[音泉](http://www.onsen.ag)にお気に入り機能を追加する Chrome 拡張です。
chrome.storage.sync にお気に入り情報を保存するので、アカウントが同期されている chrome 間でお気に入り情報が共有されます。

# features
* 番組お気に入り
  * 番組再生中に右に表示される番組情報の中にお気に入りボタンを追加
  * 番組一覧にお気に入りボタン追加(リスト表示には対応してません)
  * 左のカテゴリ欄にお気に入り番組タブを追加
* 声優お気に入り
  * 番組再生中に右に表示される番組情報の中のパーソナリティから声優をお気に入り登録できる機能追加
  * 番組一覧にお気に入りボタン追加(リスト表示には対応してません)
  * 左のカテゴリ欄にお気に入り声優タブを追加
* 視聴済み表示
  * 一度でも再生した番組は「視聴済」ラベルを表示
  
# install
[Chrome ウェブストア](https://chrome.google.com/webstore/detail/onsen-ex/hdjhpekfkgdgbngpidplkncmgddijaml?hl=ja&gl=JP)

# build
```
$ npm install
$ npm run build
```

# test
## 事前準備
まずテストを動かすページのモックを作ります。http://www.onsen.ag/ のページを以下コマンドでローカルにダウンロードしてきます。
```bash
$ npm run generate-mock
```
次にビルドされた拡張機能をテストするブラウザで読み込めるようパッケージ化します。
パッケージ化に private key が必要なので、以下コマンドなどで作成し var 以下においてください。
```bash
$ openssl genrsa 1024 > var/private.pem
```
以下コマンドで、ビルドされた成果物をパッケージング後、ChromeDriver で拡張機能を読み込めるように base64 文字列に変換し、テストの準備をします。
コードを書き換えた場合は再度このコマンドを実行する必要があります。
```bash
$ npm run prepare-test
```

## テスト実行
```
$ npm test
```
