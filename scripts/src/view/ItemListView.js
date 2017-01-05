
export default class ItemListView {
  /**
   * @type {Player}
   */
  _player;
  /**
   * @type {NodeList}
   */
  _itemElements;

  constructor({player, favorite}) {
    this._player = player;
    this._favorite = favorite;
    this._itemElements = document.querySelector('#movieList .listWrap ul').childNodes;
  }

  showOnly(ids) {
    this._itemElements.forEach((el) => {
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
    return Array.from(this._itemElements)
      .filter((el) => {
        return el.classList.contains(className);
      })
      .map((el) => el.getAttribute('id'));
  }
}