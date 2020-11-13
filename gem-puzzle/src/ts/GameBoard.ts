import Cell from './Cell';
import create from './utils/create';
// 1,100,110?,121,126,.13.,133?,16,.18.,.19.,23?,24,.26.,.27.,.28.,.30.,.34.,.36.,.39.,.42.,.45.,.46.,47?,.48.,.49.,.51.,52,.53.,54,55,.56.,.57.,.58.,.60.,.61.,.62.,.63.,64?,.66.,.67.,.71.,.72.,75,.76.,.78.,.79.,.8.,80?,81?,82?,83,84,.85.,86?,87,89?,.93.,.97.
export const main: HTMLElement = create(
  'main',
  'game',
  // [create('h1', 'title', 'RSS Sliding puzzle Game', null)],
  null,
  null,
);

export default class GameBoard {
  size: number;

  cells: Array<Cell>;

  puzzleContainer: HTMLElement;

  gameBoard: HTMLElement;

  empty: Cell;

  cellSize: number;

  bgSrc: string;

  constructor(size: number) {
    this.size = size;
    this.cellSize = Math.floor(((window.innerWidth - 30) * 0.68 - 50) / this.size); // size???
    this.puzzleContainer = create('div', 'puzzle-container', null, main);
    this.gameBoard = create('div', 'sliding-puzzle', null, this.puzzleContainer);
    this.gameBoard.style.height = `${this.cellSize * this.size + 16 / this.size}px`;
    this.gameBoard.style.width = `${this.cellSize * this.size + 16 / this.size}px`;
    this.cells = [];
    this.bgSrc = '';
    this.generateBgImg();
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

    for (let i: number = 0; i <= this.size ** 2 - 1; i += 1) {
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
    for (let i = 0; i < this.size ** 2 - 1; i += 1) {
      if (numbers[i]) {
        for (let j = 0; j < i; j += 1) {
          if (numbers[j] > numbers[i]) inv += 1;
        }
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
    const num = Math.round(Math.random() * 150);
    this.bgSrc = `https://raw.githubusercontent.com/irinainina/image-data/master/box/${num}.jpg`
  }

  async drawBg(src: string) {
    const blob = await fetch(src).then((r) => r.blob());
    const dataUrl: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.toString());
      reader.readAsDataURL(blob);
    });
    // now do something with `dataUrl`
    // https://stackoverflow.com/questions/25690641/img-url-to-dataurl-using-javascript
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.cellSize;
    canvas.height = this.cellSize;
    const img = new Image();
    img.width = this.cellSize * this.size + 16 / this.size;
    img.height = this.cellSize * this.size + 16 / this.size;
    img.src = dataUrl;
    img.onload = () => {
      this.cells.forEach((obj) => {
        const cell = obj;
        if (typeof cell.value === 'string') return;
        const left = (cell.value - 1) % this.size;
        const top = (cell.value - 1 - left) / this.size;

        const x = left * this.cellSize;
        const y = top * this.cellSize;
        const imgSize = this.cellSize - 16 / this.size;
        ctx.drawImage(img, x, y, imgSize, imgSize, 0, 0, imgSize, imgSize);
        cell.element.style.backgroundImage = `url('${canvas.toDataURL()}')`;
      });
    };
  }
}
