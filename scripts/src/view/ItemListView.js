import $ from 'jquery';

export default class ItemListView {
  /**
   * @type {Player}
   */
  _player;

  constructor({player, favorite}) {
    this._player = player;
    this._favorite = favorite;

    this._boundOnFavoriteUpdate = this._onFavoriteUpdate.bind(this);

    this._$itemList.each((index, item) => {
      const $item = $(item);
      const id = $item.attr('id');
      const isFavorited = this._favorite.includes(id);
      $item.append(this._createFavButton(isFavorited));
    });

    // 多分音泉側で document に useCapture=true のクリックハンドラが登録されているせいで、
    // 普通に登録すると反応してくれない。
    // なので document に登録して target を見る
    $(document).on('click', (e) => {
      // お気に入りボタン (p.favButton)
      if (e.target.classList.contains('favButton')) {
        const $favButton = $(e.target);
        const id = $favButton.parent().parent().attr('id');
        if (this._favorite.includes(id)) {
          this._favorite.remove(id);
        } else {
          this._favorite.add(id);
        }
      }
    });

    this._favorite.on('update', this._boundOnFavoriteUpdate);
  }

  showOnly(ids) {
    this._$itemList.each((index, item) => {
      const $item = $(item);
      const id = $item.attr('id');
      if (ids.includes(id)) {
        this._showItem($item);
      } else {
        this._hideItem($item);
      }
    });
  }

  find(className) {
    return this._$itemList.filter((index, item) => {
      return $(item).hasClass(className);
    })
      .map((index, item) => {
        return $(item).attr('id');
      });
  }

  get _$itemList() {
    return $('#movieList').find('.listWrap ul li');
  }

  _createFavButton(isFavorited) {
    const button = $('<div/>')
      .addClass('listItem')
      .addClass('fav')
      .append($('<p/>')
        .addClass('favButton')
        .text(this._getFavoriteButtonText(isFavorited))
      );
    if (isFavorited) {
      button.addClass('isFavorited');
    }
    return button;
  }

  _showItem($item) {
    $item.css({opacity: 1});
    $item.addClass('active');
  }

  _hideItem($item) {
    $item.css({opacity: 0});
    $item.removeClass('active');
  }

  _onFavoriteUpdate(data) {
    this._updateFavorited(data.id, data.isFavorited);
  }

  _updateFavorited(targetId, isFavorited) {
    this._$itemList.each((index, item) => {
      const $item = $(item);
      const id = $item.attr('id');
      if (id === targetId) {
        if (isFavorited) {
          $item.find('.fav').addClass('isFavorited');
        } else {
          $item.find('.fav').removeClass('isFavorited');
        }
        $item.find('.fav .favButton').text(this._getFavoriteButtonText(isFavorited));
        return false; // break each
      }
    });
  }

  _getFavoriteButtonText(isFavorited) {
    return isFavorited ? '★お気に入り登録済' : '☆お気に入り登録';
  }
}