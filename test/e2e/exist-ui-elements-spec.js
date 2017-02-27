
module.exports = {
  'お気に入り番組タブが存在する' : function (browser) {
    browser
      .url('http://localhost:9001/')
      .waitForElementPresent('#movieNav .categoryList .favoriteProgram', 3000)
      .end();
  },

  'お気に入り声優タブが存在する' : function (browser) {
    browser
      .url('http://localhost:9001/')
      .waitForElementPresent('#movieNav .categoryList .favoritePersonality', 3000)
      .end();
  },

  '番組一覧の各番組情報にお気に入りボタンが存在する' : function (browser) {
    browser
      .url('http://localhost:9001/')
      .waitForElementPresent('#movieList .listWrap ul li .listItem.fav .itemListFavButton', 3000)
      .end();
  },

  '番組一覧の各番組情報のパーソナリティ欄がお気に入り登録できる仕様になっている' : function (browser) {
    browser
      .url('http://localhost:9001/')
      .waitForElementPresent('#movieList .listWrap ul li .listItem.navigator a.itemListCastName', 3000)
      .end();
  },

  '番組一覧の各番組情報に視聴済ラベルが存在する' : function (browser) {
    browser
      .url('http://localhost:9001/')
      .waitForElementPresent('#movieList .listWrap ul li .listItem.listenedLabel .listenedLabelText', 3000)
      .end();
  },

  // TODO: モック作る仕組み考えないと、このテスト無理そう
  'プレイヤー横番組情報にお気に入り登録ボタンが存在する': function (browser) {
  },
  'プレイヤー横番組情報のパーソナリティ欄がお気に入り登録できる仕様になっている': function (browser) {
  }

};
