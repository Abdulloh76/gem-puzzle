export default interface Cell {
  id: number;
  value: number | string;
  left: number;
  top: number;
  element: HTMLElement;
}
