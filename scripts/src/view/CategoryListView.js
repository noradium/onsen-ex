import {EventEmitter} from 'events';

export default class CategoryListView extends EventEmitter {
  _categoryListElement;
  _favTabElement;

  constructor() {
    super();
    this._init();
  }

  _init() {
    this._categoryListElement = document.querySelector('#movieNav .categoryList');
    this._favTabElement = document.createElement('ul');
    this._favTabElement.classList.add('favorite');
    this._favTabElement.innerHTML = '<li>お気に入り</li>';

    // お気に入りタブをクリックしたときにやること
    this._favTabElement.addEventListener('click', () => {
      this._categoryListElement.querySelector('.select').classList.remove('select');
      this._favTabElement.querySelector('li').classList.add('select');
      this.emit('click', {
        target: 'favorite'
      });
    });

    // お気に入りタブ以外をクリックしたときにやること
    this._categoryListElement.querySelectorAll('ul:not(.favorite)').forEach((el) => {
      el.addEventListener('click', () => {
        this._favTabElement.querySelector('li').classList.remove('select');
      });
    });

    this._categoryListElement.appendChild(this._favTabElement);
  }
}
