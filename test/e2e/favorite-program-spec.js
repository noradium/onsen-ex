
module.exports = {
  'お気に入り登録ボタンをクリックすると、お気に入り登録される' : function (browser) {
    browser
      .url('http://localhost:9001/')
      .waitForElementPresent('#movieList .listWrap ul li .listItem.fav .itemListFavButton', 3000)
      .click('#movieList .listWrap ul li .listItem.fav .itemListFavButton')
      .execute(function () {

      }, [], function () {

      })
      .end();
  },

};
