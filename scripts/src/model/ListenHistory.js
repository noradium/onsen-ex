import Storage from '../storage/ChromeStorage';
import {EventEmitter} from 'events';

export default class ListenHistory extends EventEmitter {
  static KEY = 'history';
  _history;

  load() {
    return Storage.get(ListenHistory.KEY).then((history) => {
      this._history = history || {};
    });
  }

  _save() {
    Storage.set(ListenHistory.KEY, this._history);
  }

  update(id, updateDate) {
    this._history[id] = updateDate;
    this.emit('update', {
      id: id,
      updateDate: updateDate
    });
    this._save();
  }

  /**
   * 指定した番組の最後に視聴した回の更新日を返します。
   * 同じ番組の違う回が２個以上現れることはないこと前提の機能になっているのでひょっとすると修正が必要になるかもしれない
   * @param id
   * @returns {*}
   */
  lastListenDate(id) {
    return this._history[id];
  }
}
