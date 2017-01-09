import $ from 'jquery';

export default class ItemListView {
  /**
   * @type {Player}
   */
  _player;

  constructor({player, favoriteProgram, favoritePersonality}) {
    this._player = player;
    this._favoriteProgram = favoriteProgram;
    this._favoritePersonality = favoritePersonality;

    this._boundOnFavoriteUpdate = this._onFavoriteUpdate.bind(this);
    this._boundOnFavoritePersonalityUpdate = this._onFavoritePersonalityUpdate.bind(this);

    this._$itemList.each((index, item) => {
      const $item = $(item);
      const id = $item.attr('id');
      const isFavorited = this._favoriteProgram.includes(id);
      $item.append(this._createFavButton(isFavorited));

      const $personalityText = $item.find('.navigator span');
      const personalityText = $personalityText.text();
      const personalityList = this._parsePersonalityText(personalityText);

      $personalityText.text('');
      personalityList.forEach((personality, index) => {
        const isFavorited = this._favoritePersonality.includes(personality.castName);
        const $castName = $('<a/>')
          .addClass('itemListCastName')
          .text(personality.castName)
          .attr('data-castname', personality.castName)
          .attr('title', isFavorited ? 'お気に入りを解除する' : 'お気に入りに登録する')
          .on('click', {castName: personality.castName}, this._boundOnCastNameClick);
        if (isFavorited) {
          $castName.addClass('isFavorited');
        }

        $personalityText.append($castName);
        if (index !== personalityList.length - 1) {
          $personalityText.append(' / ');
        }
      });
    });

    // 多分音泉側で document に useCapture=true のクリックハンドラが登録されているせいで、
    // 普通に登録すると反応してくれない。
    // なので document に登録して target を見る
    $(document).on('click', (e) => {
      if (e.target.classList.contains('itemListFavButton')) {
        // お気に入りボタン (p.itemListFavButton)
        const $favButton = $(e.target);
        const id = $favButton.parent().parent().attr('id');
        if (this._favoriteProgram.includes(id)) {
          this._favoriteProgram.remove(id);
        } else {
          this._favoriteProgram.add(id);
        }
      } else if (e.target.classList.contains('itemListCastName')) {
        // 声優名 (a.itemListCastName)
        const castName = $(e.target).data('castname');
        if (this._favoritePersonality.includes(castName)) {
          this._favoritePersonality.remove(castName);
        } else {
          this._favoritePersonality.add(castName);
        }
      }
    });

    this._favoriteProgram.on('update', this._boundOnFavoriteUpdate);
    this._favoritePersonality.on('update', this._boundOnFavoritePersonalityUpdate);
  }

  showOnly(ids) {
    this._$itemList.each((index, item) => {
      const $item = $(item);
      const id = $item.attr('id');
      if (ids.includes(id)) {
        this._showItem($item);
      } else {
        this._hideItem($item);
      }
    });
  }

  showOnlyByPersonality(castNames) {
    this._$itemList.each((index, item) => {
      const $item = $(item);
      const personalityText = $item.find('.navigator span').text();
      const includesFavoritePersonality = castNames.some((castName) => {
        return personalityText.indexOf(castName) !== -1;
      });
      if (includesFavoritePersonality) {
        this._showItem($item);
      } else {
        this._hideItem($item);
      }
    });
  }

  find(className) {
    return this._$itemList.filter((index, item) => {
      return $(item).hasClass(className);
    })
      .map((index, item) => {
        return $(item).attr('id');
      });
  }

  get _$itemList() {
    return $('#movieList').find('.listWrap ul li');
  }

  /**
   * パーソナリティの中身の文字列をパースして object 化します。
   * personalityText の例 '長縄まりあ / 前川涼子'
   *
   * @param {string} text
   * @returns {object[]}
   * @private
   */
  _parsePersonalityText(text) {
    const separator = ' / ';
    return text.split(separator).map((castName) => {
      return {
        castName: castName, // 長縄まりあ
      }
    });
  }

  _createFavButton(isFavorited) {
    const button = $('<div/>')
      .addClass('listItem')
      .addClass('fav')
      .append($('<p/>')
        .addClass('itemListFavButton')
        .text(this._getFavoriteButtonText(isFavorited))
      );
    if (isFavorited) {
      button.addClass('isFavorited');
    }
    return button;
  }

  _showItem($item) {
    $item.css({opacity: 1});
    $item.addClass('active');
  }

  _hideItem($item) {
    $item.css({opacity: 0});
    $item.removeClass('active');
  }

  _onFavoriteUpdate(data) {
    this._updateFavorited(data.id, data.isFavorited);
  }

  _updateFavorited(targetId, isFavorited) {
    this._$itemList.each((index, item) => {
      const $item = $(item);
      const id = $item.attr('id');
      if (id === targetId) {
        if (isFavorited) {
          $item.find('.fav').addClass('isFavorited');
        } else {
          $item.find('.fav').removeClass('isFavorited');
        }
        $item.find('.fav .itemListFavButton').text(this._getFavoriteButtonText(isFavorited));
        return false; // break each
      }
    });
  }

  _getFavoriteButtonText(isFavorited) {
    return isFavorited ? '★お気に入り登録済' : '☆お気に入り登録';
  }

  _onFavoritePersonalityUpdate() {
    this._updatePersonalityFavorited();
  }

  _updatePersonalityFavorited() {
    this._$itemList.each((index, item) => {
      const $item = $(item);
      const $personalityText = $item.find('.navigator span');
      $personalityText.find('.itemListCastName').each((index, castNameElement) => {
        const $castName = $(castNameElement);
        const castName = $castName.data('castname');
        if (this._favoritePersonality.includes(castName)) {
          $castName
            .addClass('isFavorited')
            .attr('title', 'お気に入りを解除する');
        } else {
          $castName
            .removeClass('isFavorited')
            .attr('title', 'お気に入りに登録する');
        }
      });
    });
  }

}