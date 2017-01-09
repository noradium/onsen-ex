import Storage from '../storage/ChromeStorage';
import {EventEmitter} from 'events';

export default class FavoritePersonality extends EventEmitter {
  static KEY = 'favoritePersonality';
  _favorites;

  constructor() {
    super();
  }

  load() {
    return Storage.get(FavoritePersonality.KEY).then((favorites) => {
      this._favorites = favorites || [];
    });
  }

  _save() {
    Storage.set(FavoritePersonality.KEY, this._favorites);
  }

  add(castName) {
    this._favorites.push(castName);
    this.emit('update', {
      castName: castName,
      isFavorited: true
    });
    this._save();
  }

  remove(castName) {
    this._favorites.some((v, i) => {
      if (v == castName) {
        this._favorites.splice(i, 1);
      }
    });
    this.emit('update', {
      castName: castName,
      isFavorited: false
    });
    this._save();
  }

  get castNames() {
    return this._favorites;
  }

  includes(castName) {
    return this._favorites.includes(castName);
  }
}
