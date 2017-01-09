import FavoriteProgram from './model/FavoriteProgram';
import FavoritePersonality from './model/FavoritePersonality';
import Player from './model/Player';
import InfoTextView from './view/InfoTextView';
import CategoryListView from './view/CategoryListView';
import ItemListView from './view/ItemListView';

const favoriteProgram = new FavoriteProgram();
const favoritePersonality = new FavoritePersonality();
const player = new Player();

Promise.all([
  favoriteProgram.load(),
  favoritePersonality.load()
]).then(() => {
  const infoTextView = new InfoTextView({player, favoriteProgram, favoritePersonality});
  const categoryListView = new CategoryListView();
  const itemListView = new ItemListView({player, favoriteProgram, favoritePersonality});

  categoryListView.on('click', (data) => {
    switch (data.target) {
      case 'favoriteProgram':
        itemListView.showOnly(favoriteProgram.ids);
        break;
      case 'favoritePersonality':
        itemListView.showOnlyByPersonality(favoritePersonality.castNames);
        break;
    }
  });

  // プレイヤー横の情報が更新されるということは、
  // つまり再生中の番組が変わったということなので、
  // このタイミングで Player#currentPlayingId を更新します。
  infoTextView.on('update', () => {
    player.currentPlayingId = itemListView.find('playing')[0];
  });
});
