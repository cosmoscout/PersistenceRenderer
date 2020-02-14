import PersistencePointTuple from '../persistence-point-tuple';
import AbstractControl from './abstract-control';
import { EventType } from '../event-dispatcher';
import { IPointData } from '../point-data-interface';
import { IRenderer, pointDrawFunction } from './renderer-interface';

/**
 * Point renderer
 */
export default class Renderer extends AbstractControl implements IRenderer {
  /**
   * Canvas Element
   * @type {HTMLCanvasElement}
   * @private
   */
  private element: HTMLCanvasElement | undefined;

  /**
   * Canvas drawing context
   * @type {CanvasRenderingContext2D}
   * @private
   */
  private _context: CanvasRenderingContext2D | undefined;

  /**
   * Renders points to canvas
   * @see {pointChunks}
   * @returns {Promise<void>}
   */
  public update(data: IPointData): Promise<void[]> {
    this.pointData = data;
    return this.draw();
  }

  /**
   * Creates the canvas element
   */
  public init(): void {
    this.createElement();
  }

  /**
   * Canvas Rendering context created in
   * @see {createElement}
   * @returns {CanvasRenderingContext2D}
   */
  public getContext(): CanvasRenderingContext2D {
    if (typeof this._context === 'undefined') {
      throw new Error('Canvas context is undefined');
    }

    return this._context;
  }

  /**
   * @inheritDoc
   */
  public getElement(): HTMLElement {
    return <HTMLElement> this.element;
  }

  /**
   * Drawing canvas
   * @returns {HTMLCanvasElement}
   */
  public getCanvas(): HTMLCanvasElement {
    return <HTMLCanvasElement> this.getElement();
  }

  /**
   * Maps a point x-position from 0-1 to canvas width
   * @param x {number} Point form 0 - 1
   * @returns {number} Mapped point
   */
  public xPos(x: number): number {
    const distribution = (x - this.pointData.xMinFiltered()) / (this.pointData.xMaxFiltered() - this.pointData.xMinFiltered());
    const range = (this.rangeXMax - this.rangeXMin);

    return (distribution * range) + this.rangeXMin;
  }

  /**
   * Maps a point y-position from 0-1 to canvas height
   * @param y {number} Point form 0 - 1
   * @returns {number} Mapped point
   */
  public yPos(y: number): number {
    // Y = (X-A)/(B-A) * (D-C) + C
    // ( (X-A)/(A-B) * (C-D) ) * -1 + D  - Inverse
    // A = Xmin B = Xmax
    // c = Range Min D = range max

    const distribution = (y - this.pointData.yMin()) / (this.pointData.yMax() - this.pointData.yMin());
    const range = (this.rangeYMax - this.rangeYMin);

    return (distribution * range) + this.rangeYMin;
  }

  /**
   * The default point draw function
   * Draws a line from lower to upper
   *
   * @param point {PersistencePointTuple}
   * @param renderer {IRenderer}
   */
  public readonly defaultDrawFunction: pointDrawFunction = (point:PersistencePointTuple, renderer: IRenderer) => {
    renderer.getContext().beginPath();
    renderer.getContext().moveTo(renderer.xPos(point.lower.x), renderer.yPos(point.lower.y));
    renderer.getContext().lineTo(renderer.xPos(point.upper.x), renderer.yPos(point.upper.y));
    renderer.getContext().stroke();
  };

  /**
   * Creates the canvas that contains the drawn points
   *
   * @returns {void}
   * @private
   */
  private createElement(): void {
    const canvas = document.createElement('canvas');
    canvas.id = `persistence_canvas_${this.id}`;

    canvas.classList.add('persistence_canvas');
    canvas.width = this.controlData.settings.canvasWidth;
    canvas.height = this.controlData.settings.canvasHeight;

    const context = <CanvasRenderingContext2D>canvas.getContext('2d');
    context.strokeStyle = this.controlData.settings.strokeStyle;

    this.element = canvas;
    this._context = context;
  }

  /**
   * Draws the persistence line and point chunks
   * @returns Promise<void[]>
   *     @throws {Error} If canvas context is undefined
   * @private
   */
  private draw(): Promise<void[]> {
    const chunks = this.pointData.filteredPointsChunked();

    this.getContext().clearRect(0, 0, this.controlData.settings.canvasWidth, this.controlData.settings.canvasHeight);
    this.events.dispatch(EventType.PointsCleared);

    this.drawPersistenceLine();

    const promises: Promise<void>[] = [];

    chunks.forEach((pointArray, i) => {
      console.debug(`Drawing point chunk ${i + 1} / ${chunks.length}`);
      promises.push(this.drawPoints(pointArray, i));
    });

    const promiseAll = Promise.all(promises);

    promiseAll.then(() => {
      this.events.dispatch(EventType.PointsDrawn);
    });

    return promiseAll;
  }

  /**
   * Timeout promise used to delay chunk drawing
   * @returns {Promise<void>}
   * @private
   */
  private waitFor = (time: number): Promise<void> => new Promise((r) => setTimeout(r, time));

  /**
   * Returns either the default draw fn or a custom one from settings
   */
  private getPointDrawFunction(): pointDrawFunction {
    if (typeof this.controlData.settings.pointDrawFunction !== 'undefined') {
      return this.controlData.settings.pointDrawFunction;
    }

    return this.defaultDrawFunction;
  }

  /**
   * Asynchronously draws points on the context
   * @param points {PersistencePointTuple[]}
   * @param i {number} Current chunk index
   * @returns {Promise<void>}
   * @throws {Error} If canvas context is undefined
   * @private
   */
  private async drawPoints(points: PersistencePointTuple[], i: number): Promise<void> {
    await this.waitFor(this.controlData.settings.waitTime * i);

    points.forEach((point) => this.getPointDrawFunction()(point, this));
  }

  /**
   * Draws the persistence line from min to max
   * @returns void
   * @throws {Error} If point data is empty or context is undefined
   * @private
   */
  private drawPersistenceLine(): void {
    if (this.pointData.points.length === 0) {
      throw new Error('Can\'t draw persistence line without points.');
    }

    const filtered = this.pointData.filteredPoints();

    const first = filtered[0];
    const last = filtered[filtered.length - 1];

    this.getContext().beginPath();
    this.getContext().moveTo(
      this.xPos(first.lower.x),
      this.yPos(first.lower.y),
    );
    this.getContext().lineTo(
      this.xPos(last.lower.x),
      this.yPos(last.lower.y),
    );
    this.getContext().stroke();
  }


  /**
   * Axis x-range start
   * @returns {number}
   */
  private get rangeXMin(): number {
    return this.controlData.settings.getPadding('left');
  }

  /**
   * Axis x-range end
   * @returns {number}
   */
  private get rangeXMax(): number {
    return this.controlData.settings.canvasWidth - this.controlData.settings.getPadding('right');
  }

  /**
   * Axis y-range start
   * @returns {number}
   */
  private get rangeYMin(): number {
    return this.controlData.settings.canvasHeight - this.controlData.settings.getPadding('bottom');
  }

  /**
   * Axis y-range end
   * @returns {number}
   */
  private get rangeYMax(): number {
    return this.controlData.settings.getPadding('top');
  }
}
