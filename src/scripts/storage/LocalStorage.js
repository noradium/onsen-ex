export default class LocalStorage {
  static KEY_PREFIX = 'onsen-ex_';

  static set(key, value) {
    window.localStorage.setItem(LocalStorage.KEY_PREFIX + key, value);
  }

  static get(key) {
    return window.localStorage.getItem(LocalStorage.KEY_PREFIX + key);
  }
}
