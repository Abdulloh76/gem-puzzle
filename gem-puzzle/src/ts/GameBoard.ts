import Cell from './Cell';
import create from './utils/create';
import dontUseStrictly from './utils/dontUseImg';

export const main: HTMLElement = create(
  'main',
  'game',
  // [create('h1', 'title', 'RSS Sliding puzzle Game', null)],
  null,
  null,
);

export class GameBoard {
  size: number;

  cells: Array<Cell>;

  puzzleContainer: HTMLElement;

  gameBoard: HTMLElement;

  empty: Cell;

  cellSize: number;

  bgSrc: string;

  moves:number;

  timer:number;

  cancelTimer: boolean;

  moveNumbers: HTMLElement;

  moveProgress: HTMLElement;

  timeTime: HTMLElement;

  timeProgress: HTMLElement;

  constructor(size: number) {
    this.size = size;
    this.generateBgImg();
    this.cancelTimer = false;
    this.generateBaseLayout();
  }

  generateBaseLayout() {
    // window.innerWidth > 1024; 30,20,10=padding*2; 0.68=flex-basis; 50,30=timing-block; 0.8h;
    this.cellSize = Math.floor((window.innerHeight * 0.8 - 30) / this.size)
    if (window.innerWidth <= 1024) {
      this.cellSize = Math.floor(((window.innerWidth - 20) * 0.68 - 50) / this.size);
    }
    if (window.innerWidth <= 414) {
      this.cellSize = Math.floor((window.innerWidth - 10 - 30) / this.size);
    }

    this.puzzleContainer = create('div', 'puzzle-container', null, null);
    main.prepend(this.puzzleContainer);
    this.gameBoard = create('div', 'sliding-puzzle', null, this.puzzleContainer);
    this.gameBoard.style.height = `${this.cellSize * this.size + 16 / this.size}px`;
    this.gameBoard.style.width = `${this.cellSize * this.size + 16 / this.size}px`;
    this.cells = [];
    this.moves = 0;
    this.timer = 0;
    this.moveNumbers = create('p', 'move-numbers timing-text', 'Moves 0', null);
    this.moveProgress = create('div', 'progress-bar move-progress', null, null);
    this.timeTime = create('p', 'timing-text time-time', 'Time 00:00', null);
    this.timeProgress = create('div', 'progress-bar time-progress', null, null);
  }

  init() {
    const numbers = this.randomize();
    const emptyIndex = numbers.indexOf('');
    this.empty = {
      id: emptyIndex + 1,
      value: numbers[emptyIndex],
      left: emptyIndex % this.size,
      top: (emptyIndex - (emptyIndex % this.size)) / this.size,
      element: create('div', 'empty', `${numbers[emptyIndex]}`, null),
    };

    for (let i: number = 0; i < numbers.length; i += 1) {
      const left = i % this.size;
      const top = (i - left) / this.size;
      if (numbers[i] === '') {
        this.cells.push(this.empty);
        this.gameBoard.append(this.empty.element);
        this.generateCell(this.empty);
      } else {
        const cell = create('div', 'cell', `${numbers[i]}`, this.gameBoard);

        this.cells.push({
          id: i + 1,
          value: numbers[i],
          left,
          top,
          element: cell,
        });
        this.generateCell(this.cells[i]);
        cell.addEventListener('click', this.move);
      }
      this.cells[i].element.style.height = `${this.cellSize - 16 / this.size}px`;
      this.cells[i].element.style.width = `${this.cellSize - 16 / this.size}px`;
      // why 16? because it multiple 8(max size of board)?
      // it is just gap between cells
    }
    this.drawBg(this.bgSrc);
    this.generateTimingLayout()
    document.body.prepend(main);
  }

  randomize(): Array<number | string> {
    const numbers: Array<number | string> = [''];
    for (let i: number = 1; i <= this.size ** 2 - 1; i += 1) {
      numbers.push(i);
    }
    numbers.sort(() => Math.random() - 0.5);
    while (!this.hasSolution(numbers)) {
      numbers.sort(() => Math.random() - 0.5);
    }
    return numbers;
  }

  hasSolution(numbers: Array<number | string>): boolean {
    // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let inv = 0;
    for (let i = 0; i < numbers.length; i += 1) {
      if (numbers[i]) {
        for (let j = 0; j < i; j += 1) {
          if (numbers[j] > numbers[i]) inv += 1;
        }
      } else {
        inv += 1 + Math.floor(i / this.size);
      }
    }
    return !(inv % 2);
  }

  move = (e: Event) => {
    const cell = this.cells.filter(
      (obj) => obj.element === (e.target as Element).closest('.cell'),
    )[0];
    const leftDiff = Math.abs(this.empty.left - cell.left);
    const topDiff = Math.abs(this.empty.top - cell.top);

    if (leftDiff + topDiff > 1) {
      return;
    }

    if (!this.cancelTimer) this.generateMoves();
    else this.cancelTimer = true;

    const emptyLeft = this.empty.left;
    const emptyTop = this.empty.top;
    const emptyId = this.empty.id;

    this.empty.left = cell.left;
    this.empty.top = cell.top;
    this.empty.id = cell.id;

    cell.left = emptyLeft;
    cell.top = emptyTop;
    cell.id = emptyId;

    this.generateCell(this.empty);
    this.generateCell(cell);
  };

  generateCell(el: Cell) {
    const cell = el;
    cell.element.style.left = `${cell.left * this.cellSize + 16 / this.size}px`;
    cell.element.style.top = `${cell.top * this.cellSize + 16 / this.size}px`;
  }

  generateBgImg() {
    let num = Math.round(Math.random() * 150);
    while (dontUseStrictly.includes(num)) {
      num = Math.round(Math.random() * 150);
    }
    this.bgSrc = `https://raw.githubusercontent.com/irinainina/image-data/master/box/${num}.jpg`;
  }

  async drawBg(src: string) {
    // firstly convert image to Data Url
    const blob = await fetch(src).then((r) => r.blob());
    const dataUrl: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.toString());
      reader.readAsDataURL(blob);
    });
    // now do something with `dataUrl`
    // https://stackoverflow.com/questions/25690641/img-url-to-dataurl-using-javascript

    const img = new Image();
    img.src = dataUrl;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = 900 / this.size - 16 / this.size;
    canvas.width = 900 / this.size - 16 / this.size;
    img.onload = () => {
      this.cells.forEach((obj) => {
        const cell = obj;
        if (typeof cell.value === 'string') return;
        const left = (cell.value - 1) % this.size;
        const top = (cell.value - 1 - left) / this.size;

        const x = left * (img.height / this.size - 16 / this.size);
        const y = top * (img.height / this.size - 16 / this.size);

        const imgSize = img.height / this.size - 16 / this.size;

        ctx.drawImage(img, x, y, imgSize, imgSize, 0, 0, imgSize, imgSize);
        cell.element.style.backgroundImage = `url('${canvas.toDataURL()}')`;
      });
    };
  }

  generateTimingLayout() {
    // pain
    create('div', 'timing', [

      create('div', 'moves', [
        create('div', 'move-icon timing-icon icon-darked',
          create('img', '', null, null, ['src', './src/icons/move.svg'], ['alt', 'movement'], ['title', 'moves']), null),

        create('div', 'progress move-timing', [this.moveNumbers, this.moveProgress], null),
      ], null),

      create('div', 'time', [
        create('div', 'time-icon timing-icon icon-darked',
          create('img', '', null, null, ['src', './src/icons/hourglass.svg'], ['alt', 'hourglass'], ['title', 'time']), null),

        create('div', 'progress time-timing', [this.timeTime, this.timeProgress], null),
      ], null),
    ], this.puzzleContainer).style.height = this.gameBoard.style.height;
  }

  generateTime = () => {
    if (this.cancelTimer) return;
    const limit = (1.4 * this.size - 1.8) * 60;
    const maxHeight = this.moveProgress.closest('.progress').clientHeight;
    this.timer += 1; // seconds

    this.timeTime.textContent = `Time ${Math.floor(this.timer / 60)}:${this.timer % 60}`
    this.timeProgress.style.height = `${maxHeight * ((limit - this.timer) / limit)}px`

    setTimeout(this.generateTime, 1000);
  }
  // 3  0.8min 60 -> 1min 60moves
  // 4  1.5min 160 -> 3min 250moves
  // 5  3min 350 -> 4min 500moves
  // 6  5min 570 -> 6min 700moves
  // 7  8min 800 -> 9min 900moves
  // 8  10min 1000 -> 10min 1000moves

  // approximation time(size) = 1.4 * size - 1.8
  // approximation moves(size) = 195 * size - 508
  generateMoves = () => {
    if (!this.moves) this.generateTime();
    const limit = 195 * this.size - 508;
    const maxHeight = this.moveProgress.closest('.progress').clientHeight;
    this.moves += 1;

    this.moveNumbers.textContent = `Moves ${this.moves}`
    this.moveProgress.style.height = `${maxHeight * ((limit - this.moves) / limit)}px`
  }
}
