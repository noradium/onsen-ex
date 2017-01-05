import {EventEmitter} from 'events';

export default class Player extends EventEmitter {
  _currentPlayingId = null;

  set currentPlayingId(id) {
    this._currentPlayingId = id;
    this.emit('update');
  }

  get currentPlayingId() {
    return this._currentPlayingId;
  }
}
