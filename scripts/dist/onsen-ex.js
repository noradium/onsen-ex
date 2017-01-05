/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _LocalStorage = __webpack_require__(1);

	var _LocalStorage2 = _interopRequireDefault(_LocalStorage);

	var _Favorite = __webpack_require__(2);

	var _Favorite2 = _interopRequireDefault(_Favorite);

	var _Player = __webpack_require__(4);

	var _Player2 = _interopRequireDefault(_Player);

	var _InfoTextView = __webpack_require__(5);

	var _InfoTextView2 = _interopRequireDefault(_InfoTextView);

	var _CategoryListView = __webpack_require__(6);

	var _CategoryListView2 = _interopRequireDefault(_CategoryListView);

	var _ItemListView = __webpack_require__(7);

	var _ItemListView2 = _interopRequireDefault(_ItemListView);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(() => {
	  // localStorage が使えること前提の機能なので、チェックして使えなければ初期化しない
	  if (!_LocalStorage2.default.isAvailable) {
	    console.warn('onsen-ex: localStorage が利用不可のため初期化できませんでした。');
	    return;
	  }

	  const favorite = new _Favorite2.default();
	  const player = new _Player2.default();
	  const infoTextView = new _InfoTextView2.default({ player, favorite });
	  const categoryListView = new _CategoryListView2.default();
	  const itemListView = new _ItemListView2.default({ player, favorite });

	  categoryListView.on('click', data => {
	    if (data.target === 'favorite') {
	      itemListView.showOnly(favorite.ids);
	    }
	  });

	  // プレイヤー横の情報が更新されるということは、
	  // つまり再生中の番組が変わったということなので、
	  // このタイミングで Player#currentPlayingId を更新します。
	  infoTextView.on('update', () => {
	    player.currentPlayingId = itemListView.find('playing')[0];
	  });
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	class LocalStorage {

	  static get isAvailable() {
	    return 'localStorage' in window && window.localStorage !== null;
	  }

	  static set(key, value) {
	    localStorage.setItem(LocalStorage.KEY_PREFIX + key, JSON.stringify(value));
	  }

	  static get(key) {
	    return JSON.parse(localStorage.getItem(LocalStorage.KEY_PREFIX + key));
	  }
	}
	exports.default = LocalStorage;
	LocalStorage.KEY_PREFIX = 'onsen-ex_';

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _LocalStorage = __webpack_require__(1);

	var _LocalStorage2 = _interopRequireDefault(_LocalStorage);

	var _events = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	class Favorite extends _events.EventEmitter {

	  constructor() {
	    super();
	    this._load();
	  }

	  _load() {
	    this._favorites = _LocalStorage2.default.get(Favorite.KEY) || [];
	    this.emit('update');
	  }

	  _save() {
	    _LocalStorage2.default.set(Favorite.KEY, this._favorites);
	  }

	  add(id) {
	    this._favorites.push(id);
	    this.emit('update');
	    this._save();
	  }

	  remove(id) {
	    this._favorites.some((v, i) => {
	      if (v == id) {
	        this._favorites.splice(i, 1);
	      }
	    });
	    this.emit('update');
	    this._save();
	  }

	  get ids() {
	    return this._favorites;
	  }

	  includes(id) {
	    return this._favorites.includes(id);
	  }
	}
	exports.default = Favorite;
	Favorite.KEY = 'favorites';

/***/ },
/* 3 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _events = __webpack_require__(3);

	class Player extends _events.EventEmitter {
	  constructor(...args) {
	    var _temp;

	    return _temp = super(...args), this._currentPlayingId = null, _temp;
	  }

	  set currentPlayingId(id) {
	    this._currentPlayingId = id;
	    this.emit('update');
	  }

	  get currentPlayingId() {
	    return this._currentPlayingId;
	  }
	}
	exports.default = Player;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _events = __webpack_require__(3);

	class InfoTextView extends _events.EventEmitter {
	  /**
	   * @type {Player}
	   */
	  constructor({ player, favorite }) {
	    super();
	    this._player = player;
	    this._favorite = favorite;

	    this._boundInit = this._init.bind(this);
	    this._boundOnFavButtonClick = this._onFavButtonClick.bind(this);
	    this._boundOnFavoriteUpdate = this._onFavoriteUpdate.bind(this);

	    const infoWrapElement = document.querySelector('#movieWrap .infoWrap');
	    const mutationObserver = new MutationObserver(this._boundInit);
	    mutationObserver.observe(infoWrapElement, {
	      childList: true
	    });

	    this._favorite.on('update', this._boundOnFavoriteUpdate);
	  }
	  /**
	   * @type {Favorite}
	   */


	  _init() {
	    this._infoTextElement = document.querySelector('#movieWrap .infoWrap .programInfo .infoText');

	    // 要素自体ないときは何もしない
	    if (!this._infoTextElement) {
	      return;
	    }

	    this.emit('update');

	    const buttonBlock = document.createElement('div');
	    buttonBlock.classList.add('favButton');
	    this._buttonElement = document.createElement('button');

	    this._updateFavorited(this._favorite.includes(this._player.currentPlayingId));

	    this._buttonElement.addEventListener('click', this._boundOnFavButtonClick);

	    buttonBlock.appendChild(this._buttonElement);
	    this._infoTextElement.insertBefore(buttonBlock, this._infoTextElement.querySelector('.parsonarity'));
	  }

	  _onFavButtonClick() {
	    const currentPlayingId = this._player.currentPlayingId;
	    if (this._favorite.includes(currentPlayingId)) {
	      // お気に入り済みの場合は解除
	      this._favorite.remove(currentPlayingId);
	    } else {
	      // お気に入りされてない場合は登録
	      this._favorite.add(currentPlayingId);
	    }
	  }

	  _onFavoriteUpdate() {
	    this._updateFavorited(this._favorite.includes(this._player.currentPlayingId));
	  }

	  _updateFavorited(isFavorited) {
	    if (isFavorited) {
	      this._buttonElement.innerText = '★お気に入り登録済';
	    } else {
	      this._buttonElement.innerText = '☆お気に入り登録';
	    }
	  }
	}
	exports.default = InfoTextView;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _events = __webpack_require__(3);

	class CategoryListView extends _events.EventEmitter {

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
	    this._categoryListElement.querySelectorAll('ul:not(.favorite)').forEach(el => {
	      el.addEventListener('click', () => {
	        this._favTabElement.querySelector('li').classList.remove('select');
	      });
	    });

	    this._categoryListElement.appendChild(this._favTabElement);
	  }
	}
	exports.default = CategoryListView;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	class ItemListView {
	  /**
	   * @type {Player}
	   */
	  constructor({ player, favorite }) {
	    this._player = player;
	    this._favorite = favorite;
	    this._itemElements = document.querySelector('#movieList .listWrap ul').childNodes;
	  }
	  /**
	   * @type {NodeList}
	   */


	  showOnly(ids) {
	    this._itemElements.forEach(el => {
	      const id = el.getAttribute('id');
	      if (ids.includes(id)) {
	        this._showItem(el);
	      } else {
	        this._hideItem(el);
	      }
	    });
	  }

	  _showItem(itemElement) {
	    itemElement.style.opacity = 1;
	    itemElement.classList.add('active');
	  }

	  _hideItem(itemElement) {
	    itemElement.style.opacity = 0;
	    itemElement.classList.remove('active');
	  }

	  find(className) {
	    return Array.from(this._itemElements).filter(el => {
	      return el.classList.contains(className);
	    }).map(el => el.getAttribute('id'));
	  }
	}
	exports.default = ItemListView;

/***/ }
/******/ ]);