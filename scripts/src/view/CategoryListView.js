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
      .addClass('favorite')
      .append(
        $('<li/>')
          .text('お気に入り')
      );

    // お気に入りタブをクリックしたときにやること
    this._$favTabElement.click(() => {
      this._$categoryListElement.find('.select').removeClass('select');
      this._$favTabElement.find('li').addClass('select');
      this.emit('click', {
        target: 'favorite'
      });
    });

    // お気に入りタブ以外をクリックしたときにやること
    this._$categoryListElement.find('ul:not(.favorite)').each((index, el) => {
      $(el).click(() => {
        this._$favTabElement.find('li').removeClass('select');
      });
    });

    this._$categoryListElement.append(this._$favTabElement);
  }
}
