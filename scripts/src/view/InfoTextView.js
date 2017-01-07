import {EventEmitter} from 'events';
import $ from 'jquery';

export default class InfoTextView extends EventEmitter {
  /**
   * @type {Player}
   */
  _player;
  /**
   * @type {Favorite}
   */
  _favorite;
  _$infoTextElement;
  _$button;

  constructor({player, favorite}) {
    super();
    this._player = player;
    this._favorite = favorite;

    this._boundInit = this._init.bind(this);
    this._boundOnFavButtonClick = this._onFavButtonClick.bind(this);
    this._boundOnFavoriteUpdate = this._onFavoriteUpdate.bind(this);

    const infoWrapElement = document.querySelector('#movieWrap .infoWrap');
    const mutationObserver = new MutationObserver(this._boundInit);
    mutationObserver.observe(infoWrapElement, {
      childList: true
    });

    this._favorite.on('update', this._boundOnFavoriteUpdate);
  }

  _init() {
    this._$infoTextElement = $('#movieWrap').find('.infoWrap .programInfo .infoText');

    // 要素自体ないときは何もしない
    if (this._$infoTextElement.length === 0) {
      return;
    }

    this.emit('update');

    this._$button = $('<button/>')
      .click(this._boundOnFavButtonClick);

    $('<div/>')
      .addClass('favButton')
      .append(this._$button)
      .insertBefore(this._$infoTextElement.find('.parsonarity'));

    this._updateFavorited(this._favorite.includes(this._player.currentPlayingId));
  }

  _onFavButtonClick() {
    const currentPlayingId = this._player.currentPlayingId;
    if (this._favorite.includes(currentPlayingId)) {
      // お気に入り済みの場合は解除
      this._favorite.remove(currentPlayingId);
    } else {
      // お気に入りされてない場合は登録
      this._favorite.add(currentPlayingId);
    }
  }

  _onFavoriteUpdate() {
    this._updateFavorited(this._favorite.includes(this._player.currentPlayingId));
  }

  _updateFavorited(isFavorited) {
    if (!this._$button) {
      return;
    }

    if (isFavorited) {
      this._$button.text('★お気に入り登録済');
    } else {
      this._$button.text('☆お気に入り登録');
    }
  }
}
