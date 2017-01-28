import {EventEmitter} from 'events';
import $ from 'jquery';

export default class InfoTextProgramFavoriteView extends EventEmitter {
  /**
   * @type {Player}
   */
  _player;
  /**
   * @type {FavoriteProgram}
   */
  _favoriteProgram;
  _$infoTextElement;
  _$button;

  constructor({player, favoriteProgram}) {
    super();
    this._player = player;
    this._favoriteProgram = favoriteProgram;

    this._boundOnFavButtonClick = this._onFavButtonClick.bind(this);
    this._boundOnFavoriteUpdate = this._onFavoriteUpdate.bind(this);

    this._favoriteProgram.on('update', this._boundOnFavoriteUpdate);
  }

  init($infoText) {
    this._$infoTextElement = $infoText;

    // 要素自体ないときは何もしない
    if (this._$infoTextElement.length === 0) {
      return;
    }

    this._$button = $('<button/>')
      .click(this._boundOnFavButtonClick);

    $('<div/>')
      .addClass('favButton')
      .append(this._$button)
      .insertBefore(this._$infoTextElement.find('.parsonarity'));

    this._updateFavorited(this._favoriteProgram.includes(this._player.currentPlayingId));
  }

  _onFavButtonClick() {
    const currentPlayingId = this._player.currentPlayingId;
    if (this._favoriteProgram.includes(currentPlayingId)) {
      // お気に入り済みの場合は解除
      this._favoriteProgram.remove(currentPlayingId);
    } else {
      // お気に入りされてない場合は登録
      this._favoriteProgram.add(currentPlayingId);
    }
  }

  _onFavoriteUpdate() {
    this._updateFavorited(this._favoriteProgram.includes(this._player.currentPlayingId));
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
