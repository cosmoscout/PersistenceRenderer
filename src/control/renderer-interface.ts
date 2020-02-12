/**
 * Render interface for accessing the canvas and canvas context
 */
export interface IRenderer {
  getCanvas(): HTMLCanvasElement;
  getContext(): CanvasRenderingContext2D;

  xPos(x: number): number;
  yPos(y: number): number;
}
