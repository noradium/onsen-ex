import {EventEmitter} from 'events';
import $ from 'jquery';
import InfoTextProgramFavoriteView from './module/InfoTextProgramFavoriteView';
import InfoTextPersonalityFavoriteView from './module/InfoTextPersonalityFavoriteView';

export default class InfoTextView extends EventEmitter {
  /**
   * @type {Player}
   */
  _player;
  /**
   * @type {FavoriteProgram}
   */
  favoriteProgram;
  _$infoTextElement;

  constructor({player, favoriteProgram, favoritePersonality}) {
    super();
    this._player = player;
    this.favoriteProgram = favoriteProgram;

    this._programFavoriteView = new InfoTextProgramFavoriteView({player, favoriteProgram});
    this._personalityFavoriteView = new InfoTextPersonalityFavoriteView({player, favoritePersonality});
    this._boundInit = this._init.bind(this);

    const infoWrapElement = document.querySelector('#movieWrap .infoWrap');
    const mutationObserver = new MutationObserver(this._boundInit);
    mutationObserver.observe(infoWrapElement, {
      childList: true
    });
  }

  _init() {
    this._$infoTextElement = $('#movieWrap').find('.infoWrap .programInfo .infoText');

    // 要素自体ないときは何もしない
    if (this._$infoTextElement.length === 0) {
      return;
    }

    this.emit('update');

    this._programFavoriteView.init(this._$infoTextElement);
    this._personalityFavoriteView.init(this._$infoTextElement);
  }
}
