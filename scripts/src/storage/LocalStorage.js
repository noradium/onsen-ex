export default class LocalStorage {
  static KEY_PREFIX = 'onsen-ex_';

  static get isAvailable() {
    return ('localStorage' in window) && (window.localStorage !== null);
  }

  static set(key, value) {
    localStorage.setItem(LocalStorage.KEY_PREFIX + key, JSON.stringify(value));
  }

  static get(key) {
    return JSON.parse(localStorage.getItem(LocalStorage.KEY_PREFIX + key));
  }
}
