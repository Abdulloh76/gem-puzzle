import Cell from './Cell';
import create from './utils/create';

const main: HTMLElement = create(
  'main',
  '',
  // [create('h1', 'title', 'RSS Sliding puzzle Game', null)],
  null,
  null,
);

export default class GameBoard {
  cells: Array<Cell>;

  container: HTMLElement;

  board: HTMLElement;

  empty: Cell;

  cellSize: number;

  constructor() {
    this.container = create('div', 'puzzle-container', null, main);
    this.board = create('div', 'sliding-puzzle', null, this.container);
    this.cellSize = 100; // px ? vw
    this.cells = [];
    this.empty = {
      id: 0,
      left: 0,
      right: 0,
      element: create('div', 'empty', null, this.board),
    };
    this.cells.push(this.empty);
  }

  init(size: number) {
    for (let i: number = 1; i <= size ** 2 - 1; i += 1) {
      const cell: HTMLElement = create('div', 'cell', `${i}`, this.board);
      const left = i % size;
      const right = (i - left) / size;

      this.cells.push({
        id: i,
        left,
        right,
        element: cell,
      });

      cell.style.left = `${left * this.cellSize}px`;
      cell.style.right = `${right * this.cellSize}px`;

      cell.addEventListener('click', this.move);
    }

    document.body.prepend(main);
  }

  randomize() {}

  move() {}

  generateLayout() {}
}
