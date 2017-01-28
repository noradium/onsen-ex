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
  _favoritePersonality;
  _$infoTextElement;

  constructor({player, favoritePersonality}) {
    super();
    this._player = player;
    this._favoritePersonality = favoritePersonality;

    this._boundOnCastNameClick = this._onCastNameClick.bind(this);
    this._boundOnFavoriteUpdate = this._onFavoriteUpdate.bind(this);

    this._favoritePersonality.on('update', this._boundOnFavoriteUpdate);
  }

  init($infoText) {
    this._$infoTextElement = $infoText;

    // 要素自体ないときは何もしない
    if (this._$infoTextElement.length === 0) {
      return;
    }

    const $personalityText = this._$infoTextElement.find('.parsonarity .txt');
    const personalityText = $personalityText.text();
    const personalityList = this._parsePersonalityText(personalityText);

    $personalityText.text('');
    personalityList.forEach((personality, index) => {
      const isFavorited = this._favoritePersonality.includes(personality.castName);
      const $castName = $('<span/>')
        .addClass('castName')
        .text(personality.castName)
        .attr('data-castname', personality.castName)
        .attr('title', isFavorited ? 'お気に入りを解除する' : 'お気に入りに登録する')
        .on('click', {castName: personality.castName}, this._boundOnCastNameClick);
      if (isFavorited) {
        $castName.addClass('isFavorited');
      }

      $personalityText
        .append($castName)
        .append(personality.characterText);
      if (index !== personalityList.length - 1) {
        $personalityText.append(' / ');
      }
    });
  }

  /**
   * パーソナリティの中身の文字列をパースして object 化します。
   * personalityText の例 '長縄まりあ（本田珠輝 役） / 前川涼子（布田裕美音 役）'
   *
   * @param {string} text
   * @returns {object[]}
   * @private
   */
  _parsePersonalityText(text) {
    const separator = ' / ';
    return text.split(separator).map((person) => {
      const matched = person.match(/([^（）]+)(（([^（）]+)\s役）)?/);
      return {
        castName: matched[1], // 長縄まりあ
        characterText: matched[2], // （本田珠輝 役）
        characterName: matched[3] // 本田珠輝
      }
    });
  }

  _onCastNameClick(event) {
    const castName = event.data.castName;
    if (this._favoritePersonality.includes(castName)) {
      // お気に入り済みの場合は解除
      this._favoritePersonality.remove(castName);
    } else {
      // お気に入りされてない場合は登録
      this._favoritePersonality.add(castName);
    }
  }

  _onFavoriteUpdate() {
    this._updateFavorited();
  }

  _updateFavorited() {
    if (!this._$infoTextElement) {
      return;
    }

    const $personalityText = this._$infoTextElement.find('.parsonarity .txt');
    $personalityText.find('.castName').each((index, castNameElement) => {
      const $castName = $(castNameElement);
      const castName = $castName.data('castname');
      if (this._favoritePersonality.includes(castName)) {
        $castName
          .addClass('isFavorited')
          .attr('title', 'お気に入りを解除する');
      } else {
        $castName
          .removeClass('isFavorited')
          .attr('title', 'お気に入りに登録する');
      }
    });
  }
}
