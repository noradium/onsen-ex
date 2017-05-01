import LocalStorage from './storage/LocalStorage';

const VOLUME_STORAGE_KEY = 'html5Player_volume';
const DEFAULT_VOLUME = 0.5;

(() => {
  _movieID = 'html5Player';

  const _thisMovie = window.thisMovie;
  function thisMovie(movieID) {
    if (movieID === 'html5Player') {
      return _html5Player;
    }
    return _thisMovie(movieID);
  }
  window.thisMovie = thisMovie;

  const _setMovie = window.setMovie;
  function setMovie(id) {
    _usePlayer('html5Player');
    _setMovie(id);
  }
  window.setMovie = setMovie;

  function _usePlayer(playerId) {
    if (window._movieID === playerId) {
      return;
    }

    window._movieID = playerId;

    if (playerId === 'mainPlayer') {
      _html5Player.pause();
      document.querySelector('#movieWrap .playerWrap').classList.remove('html5Player');
      document.querySelector('#movieWrap .playerWrap').classList.add('mainPlayer');
    } else if (playerId === 'html5Player') {
      // 停止するため空のmovieを再生
      // flash 無効のときは playMovie が存在しないのでチェック
      if (typeof window.thisMovie('mainPlayer').playMovie === 'function') {
        window.thisMovie('mainPlayer').playMovie({
          allowExpand: true,
          autoPlay: false,
          id: "",
          infoThumbPath: "",
          link: "",
          moviePath: "",
          playListMode: false,
          playerMode: "normal",
          programType: "",
          thumbnailPath: "",
          totalTime: 0,
          type: "movie"
        });
      }
      document.querySelector('#movieWrap .playerWrap').classList.add('html5Player');
      document.querySelector('#movieWrap .playerWrap').classList.remove('mainPlayer');
    }
  }

  class HTML5Player {
    _video;

    constructor() {
      this._resetPlayer();
    }

    _resetPlayer() {
      const video = document.createElement('video');
      video.setAttribute('id', 'html5Player');
      video.setAttribute('width', '450');
      video.setAttribute('height', '300');
      video.setAttribute('controls', '');
      const playerWrap = document.querySelector('#movieWrap .playerWrap');
      playerWrap.appendChild(video);
      this._video = video;

      document.querySelector('#movieWrap .playerWrap').classList.add('html5Player');

      video.addEventListener('error', this._onVideoError.bind(this));
      video.addEventListener('volumechange', (event) => {
        LocalStorage.set(VOLUME_STORAGE_KEY, video.volume);
      });
    }

    pause() {
      this._video.pause();
    }

    /**
     *
     * @param {object} movie
     * @param {boolean} movie.allowExpand
     * @param {boolean} movie.autoPlay
     * @param {string} movie.id
     * @param {string} movie.link
     * @param {string} movie.moviePath
     * @param {boolean} movie.playlistMode
     * @param {number} movie.playTime
     * @param {string} movie.playerMode
     * @param {string} movie.programType
     * @param {string} movie.thumbnailPath
     * @param {number} movie.toralTime
     * @param {string} movie.type
     */
    playMovie(movie) {
      this._video.src = movie.moviePath;
      this._video.poster = movie.thumbnailPath;
      this._video.volume = LocalStorage.get(VOLUME_STORAGE_KEY) || DEFAULT_VOLUME;
      this._video.play();
    }

    playInfoMovie(movie) {
      this.playMovie(movie);
    }

    _onVideoError() {
      _usePlayer('mainPlayer');
      window.playMovie();
    }

  }

  const _html5Player = new HTML5Player();

})();
