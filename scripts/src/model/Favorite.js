import Storage from '../storage/ChromeStorage';
import {EventEmitter} from 'events';

export default class Favorite extends EventEmitter {
  static KEY = 'favorites';
  _favorites;

  constructor() {
    super();
  }

  load() {
    return Storage.get(Favorite.KEY).then((favorites) => {
      this._favorites = favorites || [];
    });
  }

  _save() {
    Storage.set(Favorite.KEY, this._favorites);
  }

  add(id) {
    this._favorites.push(id);
    this.emit('update', {
      id: id,
      isFavorited: true
    });
    this._save();
  }

  remove(id) {
    this._favorites.some((v, i) => {
      if (v == id) {
        this._favorites.splice(i, 1);
      }
    });
    this.emit('update', {
      id: id,
      isFavorited: false
    });
    this._save();
  }

  get ids() {
    return this._favorites;
  }

  includes(id) {
    return this._favorites.includes(id);
  }
}
