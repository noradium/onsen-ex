import {EventEmitter} from 'events';

export default class InfoTextView extends EventEmitter {
  /**
   * @type {Player}
   */
  _player;
  /**
   * @type {Favorite}
   */
  _favorite;
  _infoTextElement;
  _buttonElement;

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
    this._infoTextElement = document.querySelector('#movieWrap .infoWrap .programInfo .infoText');

    // 要素自体ないときは何もしない
    if (!this._infoTextElement) {
      return;
    }

    this.emit('update');

    const buttonBlock = document.createElement('div');
    buttonBlock.classList.add('favButton');
    this._buttonElement = document.createElement('button');

    this._updateFavorited(this._favorite.includes(this._player.currentPlayingId));

    this._buttonElement.addEventListener('click', this._boundOnFavButtonClick);

    buttonBlock.appendChild(this._buttonElement);
    this._infoTextElement.insertBefore(buttonBlock, this._infoTextElement.querySelector('.parsonarity'));
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
    if (isFavorited) {
      this._buttonElement.innerText = '★お気に入り登録済';
    } else {
      this._buttonElement.innerText = '☆お気に入り登録';
    }
  }
}
