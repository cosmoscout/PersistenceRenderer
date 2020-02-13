import PersistencePointTuple from '../persistence-point-tuple';

/**
 * Render interface for accessing the canvas and canvas context
 */
export interface IRenderer {
  getCanvas(): HTMLCanvasElement;
  getContext(): CanvasRenderingContext2D;

  readonly defaultDrawFunction: pointDrawFunction;

  xPos(x: number): number;
  yPos(y: number): number;
}

/**
 * Custom function for drawing points on the canvas.
 * The render instance holds the canvas context and exposes methods for translating a x/y pos to canvas coordinates
 *
 * @param point {PersistencePointTuple} The current tuple
 * @param renderer {IRenderer} The render instance
 */
export type pointDrawFunction = {
  (point: PersistencePointTuple, renderer: IRenderer): void;
};
