
module.exports = {
  'Contents test' : function (browser) {
    browser
      .url('http://localhost:9001/')
      // .url('http://www.onsen.ag')
      .pause(3000)
      .waitForElementPresent('#movieNav .categoryList .favoriteProgram', 30000)
      .assert.elementPresent('#movieNav .categoryList .favoriteProgram')
      .end();
  }
};
