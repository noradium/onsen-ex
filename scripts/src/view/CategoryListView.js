import {EventEmitter} from 'events';
import $ from 'jquery';

export default class CategoryListView extends EventEmitter {
  _$categoryListElement;
  _$favTabElement;

  constructor() {
    super();
    this._init();
  }

  _init() {
    this._$categoryListElement = $('#movieNav').find('.categoryList');
    this._$favTabElement = $('<ul/>')
      .addClass('favoriteProgram')
      .append(
        $('<li/>')
          .text('お気に入り番組')
      );
    this._$personalityFavTabElement = $('<ul/>')
      .addClass('favoritePersonality')
      .append(
        $('<li/>')
          .text('お気に入り声優')
      );

    // お気に入り番組タブをクリックしたときにやること
    this._$favTabElement.on('click', () => {
      this._$categoryListElement.find('.select').removeClass('select');
      this._$favTabElement.find('li').addClass('select');
      this.emit('click', {
        target: 'favoriteProgram'
      });
    });

    // お気に入り声優タブをクリックしたときにやること
    this._$personalityFavTabElement.on('click', () => {
      this._$categoryListElement.find('.select').removeClass('select');
      this._$personalityFavTabElement.find('li').addClass('select');
      this.emit('click', {
        target: 'favoritePersonality'
      });
    });

    // お気に入り番組タブ以外をクリックしたときにやること
    this._$categoryListElement.find('ul:not(.favoriteProgram)').each((index, el) => {
      $(el).click(() => {
        this._$favTabElement.find('li').removeClass('select');
      });
    });

    // お気に入り声優タブ以外をクリックしたときにやること
    this._$categoryListElement.find('ul:not(.favoritePersonality)').each((index, el) => {
      $(el).click(() => {
        this._$personalityFavTabElement.find('li').removeClass('select');
      });
    });

    this._$categoryListElement.append(this._$favTabElement);
    this._$categoryListElement.append(this._$personalityFavTabElement);
  }
}
