import Cell from './Cell';
import create from './utils/create';

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

  constructor(size: number) {
    this.size = size;
    this.puzzleContainer = create('div', 'puzzle-container', null, main);
    this.gameBoard = create(
      'div',
      'sliding-puzzle',
      null,
      this.puzzleContainer,
    );
    this.cellSize = Math.floor(
      ((window.innerWidth - 30) * 0.68 - 50) / this.size,
    );
    this.cells = [];
  }

  init() {
    const numbers = this.randomize();
    for (let i: number = 0; i <= this.size ** 2 - 1; i += 1) {
      const left = i % this.size;
      const top = (i - left) / this.size;
      if (numbers[i]) {
        this.cells.push({
          id: i + 1,
          left,
          top,
          element: create('div', 'cell', `${numbers[i]}`, this.gameBoard),
        });
        this.cells[i].element.addEventListener('click', this.move);
      } else {
        this.empty = {
          id: i + 1,
          left,
          top,
          element: create('div', 'empty', `${numbers[i]}`, this.gameBoard),
        }
        this.cells.push(this.empty)
      }
      this.cells[i].element.style.height = `${this.cellSize - 16 / this.size}px`;
      this.cells[i].element.style.width = `${this.cellSize - 16 / this.size}px`;
      // why 16? because it multiple 8(max size of board)?
      this.cells[i].element.style.left = `${left * this.cellSize + 16 / this.size}px`;
      this.cells[i].element.style.top = `${top * this.cellSize + 16 / this.size}px`;
    }

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
    // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ''];
    let inv = 0;
    for (let i = 0; i < numbers.length; i += 1) {
      if (numbers[i]) {
        for (let j = 0; j < i; j += 1) if (numbers[j] > numbers[i]) inv += 1;
      } else {
        inv += 1 + Math.floor(i / this.size);
      }
    }
    return !(inv % 2);
  }

  move() {}

  generateLayout() {}
}
