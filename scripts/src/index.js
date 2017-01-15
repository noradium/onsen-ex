import FavoriteProgram from './model/FavoriteProgram';
import FavoritePersonality from './model/FavoritePersonality';
import Player from './model/Player';
import ListenHistory from './model/ListenHistory';
import InfoTextView from './view/InfoTextView';
import CategoryListView from './view/CategoryListView';
import ItemListView from './view/ItemListView';

const favoriteProgram = new FavoriteProgram();
const favoritePersonality = new FavoritePersonality();
const player = new Player();
const listenHistory = new ListenHistory();

Promise.all([
  favoriteProgram.load(),
  favoritePersonality.load(),
  listenHistory.load()
]).then(() => {
  const infoTextView = new InfoTextView({player, favoriteProgram, favoritePersonality});
  const categoryListView = new CategoryListView();
  const itemListView = new ItemListView({player, favoriteProgram, favoritePersonality, listenHistory});

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
    const playing = itemListView.find('playing')[0];
    player.currentPlayingId = playing.id;
    listenHistory.update(playing.id, playing.update);
  });
});
