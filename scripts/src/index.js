import LocalStorage from './storage/LocalStorage';
import Favorite from './model/Favorite';
import Player from './model/Player';
import InfoTextView from './view/InfoTextView';
import CategoryListView from './view/CategoryListView';
import ItemListView from './view/ItemListView';

(() => {
  // localStorage が使えること前提の機能なので、チェックして使えなければ初期化しない
  if (!LocalStorage.isAvailable) {
    console.warn('onsen-ex: localStorage が利用不可のため初期化できませんでした。');
    return;
  }

  const favorite = new Favorite();
  const player = new Player();
  const infoTextView = new InfoTextView({player, favorite});
  const categoryListView = new CategoryListView();
  const itemListView = new ItemListView({player, favorite});

  categoryListView.on('click', (data) => {
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
