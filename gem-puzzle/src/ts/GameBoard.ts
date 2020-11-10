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

  puzzleContainer: HTMLElement;

  gameBoard: HTMLElement;

  empty: Cell;

  cellSize: number;

  constructor() {
    this.puzzleContainer = create('div', 'puzzle-container', null, main);
    this.gameBoard = create('div', 'sliding-puzzle', null, this.puzzleContainer);
    this.cellSize = 100; // px ? vw
    this.cells = [];
    this.empty = {
      id: 0,
      left: 0,
      top: 0,
      element: create('div', 'empty', null, this.gameBoard),
    };
    this.cells.push(this.empty);
  }

  init(size: number) {
    for (let i: number = 1; i <= size ** 2 - 1; i += 1) {
      const cell: HTMLElement = create('div', 'cell', `${i}`, this.gameBoard);
      const left = i % size;
      const top = (i - left) / size;

      this.cells.push({
        id: i,
        left,
        top,
        element: cell,
      });

      cell.style.left = `${left * this.cellSize}px`;
      cell.style.top = `${top * this.cellSize}px`;

      cell.addEventListener('click', this.move);
    }

    document.body.prepend(main);
    console.log(this.gameBoard.innerHTML)
  }

  randomize() {}

  move() {}

  generateLayout() {}
}
