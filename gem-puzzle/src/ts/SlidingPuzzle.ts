import { GameBoard, main } from './GameBoard';
import create from './utils/create';

export default class SlidingGame extends GameBoard {
  optionsContainer: HTMLElement;

  puzzleImg: HTMLElement;

  options: HTMLElement;

  // options
  changeImg: HTMLElement;

  sound: HTMLElement;

  changeSize: HTMLElement;

  saveGame: HTMLElement;

  shuffle: HTMLElement;

  savedGames: HTMLElement;

  topScores: HTMLElement;

  solvePuzzle: HTMLElement;

  constructor(size: number) {
    super(size);
    super.init();
    this.optionsContainer = create('div', 'options-container', null, main);
    this.puzzleImg = create('img', 'puzzle-image', null, this.optionsContainer, [
      'src',
      this.bgSrc,
    ]);
    this.options = create('div', 'options', null, this.optionsContainer);
  }

  generateOptions() {
    //  changeImage
    this.changeImg = create('button', 'option change-image icon-darked', [
      create('img', '', null, null, ['src', './src/icons/images.svg']),
      create('p', '', 'change image', null),
    ], this.options);
    //  sound
    this.sound = create('button', 'option sound icon-darked', [
      create('img', '', null, null, ['src', './src/icons/volume.svg']),
      create('p', '', 'sound', null),
    ], this.options);
    //  changeSize
    this.changeSize = create('button', 'option change-size icon-darked', [
      create('img', '', null, null, ['src', './src/icons/matrix.svg']),
      create('p', '', 'change size', null),
    ], this.options);
    //  saveGame
    this.saveGame = create('button', 'option save-game icon-darked', [
      create('img', '', null, null, ['src', './src/icons/save-game.svg']),
      create('p', '', 'save game', null),
    ], this.options);
    //  shuffle
    this.shuffle = create('button', 'option shuffle icon-darked', [
      create('img', '', null, null, ['src', './src/icons/shuffle.svg']),
      create('p', '', 'new', null),
    ], this.options);
    //  savedGames
    this.savedGames = create('button', 'option saved-games icon-darked', [
      create('img', '', null, null, ['src', './src/icons/saved-games.svg']),
      create('p', '', 'saved games', null),
    ], this.options);
    //  topScores
    this.topScores = create('button', 'option top-scores icon-darked', [
      create('img', '', null, null, ['src', './src/icons/podium.svg']),
      create('p', '', 'top scores', null),
    ], this.options);
    //  solvePuzzle
    this.solvePuzzle = create('button', 'option solve-puzzle icon-darked', [
      create('img', '', null, null, ['src', './src/icons/solution.svg']),
      create('p', '', 'solve puzzle', null),
    ], this.options);

    this.events();
  }

  events() {
    this.changeImg.addEventListener('click', this.changeBgImage)
    this.sound.addEventListener('click', this.soundHandler)
    this.changeSize.addEventListener('click', this.sizeHandler)
    this.saveGame.addEventListener('click', this.saveCurrentGame)
    this.shuffle.addEventListener('click', this.shuffleGame)
    this.savedGames.addEventListener('click', this.showSavedGames)
    this.topScores.addEventListener('click', this.showTopScores)
    this.solvePuzzle.addEventListener('click', this.solveHandler)
  }

  changeBgImage = () => {
    super.generateBgImg();
    super.drawBg(this.bgSrc);
    this.puzzleImg.setAttribute('src', this.bgSrc);
  }

  soundHandler() {}

  sizeHandler() {}

  saveCurrentGame() {}

  shuffleGame() {}

  showSavedGames() {}

  showTopScores() {}

  solveHandler() {}

}
