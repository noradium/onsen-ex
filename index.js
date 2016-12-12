(function () {
  /*******************
   * define functions
   *******************/

  /**
   * お気に入りボタンの初期化をします
   */
  function initFavButton() {
    var infoTextElement = document.querySelector('#movieWrap .infoWrap .programInfo .infoText');

    // 再生中でないときは要素自体ないので、そのときは何もしない
    if (!infoTextElement) {
      return;
    }

    var buttonBlock = document.createElement('div');
    buttonBlock.classList.add('favButton');
    var button = document.createElement('button');

    var playingCard = findPlayingCard();
    var id = playingCard.getAttribute('id');

    button.innerText = isFavorited(id) ? '★お気に入り登録済' : '☆お気に入り登録';
    button.addEventListener('click', function () {
      if (isFavorited(id)) {
        button.innerText = '☆お気に入り登録';
        removeFavorite(id);
      } else {
        button.innerText = '★お気に入り登録済';
        addFavorite(id);
      }
    });

    buttonBlock.appendChild(button);
    infoTextElement.insertBefore(buttonBlock, infoTextElement.querySelector('.parsonarity'));
  }

  /**
   * 現在再生中の番組情報のDOMを取得します。（リストに表示されるカードみたいなやつ）
   * @returns {Node}
   */
  function findPlayingCard() {
    var list = Array.from(document.querySelectorAll('#movieList .listWrap ul.clr li'));
    return list.find(function (el) {
      return el.classList.contains('playing');
    });
  }

  /**
   * お気に入りタブの初期化をします
   */
  function createFavTab() {
    var categoryList = document.querySelector('#movieNav .categoryList');
    var favTab = document.createElement('ul');
    favTab.classList.add('favorite');
    favTab.innerHTML = '<li>お気に入り</li>';

    // お気に入りタブをクリックしたときにやること
    favTab.addEventListener('click', function () {
      // 前に選択中のタブによっては、全ての番組が表示されていないことがあるので、`ALL`をクリックして全て表示させておく
      categoryList.querySelector('.btnSort.all').click();

      categoryList.querySelector('.select').classList.remove('select');
      favTab.querySelector('li').classList.add('select');

      var list = Array.from(document.querySelectorAll('#movieList .listWrap ul.clr li'));
      list.forEach(function (el) {
        var id = el.getAttribute('id');
        if (isFavorited(id)) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    });

    // お気に入りタブ以外をクリックしたときにやること
    categoryList.querySelectorAll('ul:not(.favorite)').forEach(function (el) {
      el.addEventListener('click', function () {
        favTab.querySelector('li').classList.remove('select');
      });
    });

    categoryList.appendChild(favTab);
  }

  /***********
   * favorite
   ***********/

  var favorites = [];
  var localStorageKey = 'onsen-ex_favorites';

  function restoreFavorites() {
    favorites = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  }

  function saveFavorites() {
    localStorage.setItem(localStorageKey, JSON.stringify(favorites));
  }

  function addFavorite(id) {
    favorites.push(id);
    saveFavorites();
  }

  function removeFavorite(id) {
    favorites.some(function(v, i) {
      if (v == id) {
        favorites.splice(i, 1);
      }
    });
    saveFavorites();
  }

  function isFavorited(id) {
    return favorites.includes(id);
  }

  /**********
   * process
   **********/
  restoreFavorites();

  var infoWrapElement = document.querySelector('#movieWrap .infoWrap');
  var mutationObserver = new MutationObserver(initFavButton);
  mutationObserver.observe(infoWrapElement, {
    childList: true
  });

  createFavTab();
})();