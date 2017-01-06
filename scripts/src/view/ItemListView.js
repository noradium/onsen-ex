import $ from 'jquery';

export default class ItemListView {
  /**
   * @type {Player}
   */
  _player;

  constructor({player, favorite}) {
    this._player = player;
    this._favorite = favorite;
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

  get _$itemList() {
    return $('#movieList').find('.listWrap ul li');
  }

  _showItem($item) {
    $item.css({opacity: 1});
    $item.addClass('active');
  }

  _hideItem($item) {
    $item.css({opacity: 0});
    $item.removeClass('active');
  }

  find(className) {
    return this._$itemList.filter((index, item) => {
        return $(item).hasClass(className);
      })
      .map((index, item) => {
        return $(item).attr('id');
      });
  }
}