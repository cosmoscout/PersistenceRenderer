import PersistencePointTuple from '../point-tuple';
import AbstractControlModule from './abstract-control-module';
import { EventType } from '../event-dispatcher';
import { IPointData } from '../point-data-interface';
import { IRenderer } from './renderer-interface';

/**
 * Point renderer
 */
export default class Renderer extends AbstractControlModule implements IRenderer {
  /**
   * @type {HTMLCanvasElement}
   * @private
   */
  private element: HTMLCanvasElement | undefined;

  /**
   * @type {CanvasRenderingContext2D}
   * @private
   */
  private _context: CanvasRenderingContext2D | undefined;

  /**
   * Renders pointChunks to canvas
   * @see {pointChunks}
   * @return {Promise<void>}
   */
  public update(data: IPointData): Promise<void[]> {
    this.pointData = data;
    (<HTMLCanvasElement> this.element).classList.remove('hidden');
    return this.draw();
  }

  public init(): void {
    this.createElement();
  }

  /**
   * Canvas Rendering context created in
   * @see {createElement}
   * @return {CanvasRenderingContext2D}
   */
  public getContext(): CanvasRenderingContext2D {
    return <CanvasRenderingContext2D> this._context;
  }

  /**
   * @inheritDoc
   */
  public getElement(): HTMLElement {
    return <HTMLElement> this.element;
  }

  /**
   * Drawing canvas
   */
  public getCanvas(): HTMLCanvasElement {
    return <HTMLCanvasElement> this.getElement();
  }

  /**
   * Maps a point x-position from 0-1 to canvas width
   * @param x {number} Point form 0 - 1
   * @returns {number} Mapped point
   */
  public xPos(x: number) {
    const distribution = (x - this.pointData.xMin()) / (this.pointData.xMax() - this.pointData.xMin());
    const range = (this.rangeXMax - this.rangeXMin);

    return (distribution * range) + this.rangeXMin;
  }

  /**
   * Maps a point y-position from 0-1 to canvas height
   * @param y {number} Point form 0 - 1
   * @returns {number} Mapped point
   */
  public yPos(y: number) {
    // Y = (X-A)/(B-A) * (D-C) + C
    // ( (X-A)/(A-B) * (C-D) ) * -1 + D  - Inverse
    // A = Xmin B = Xmax
    // c = Range Min D = range max

    const distribution = (y - this.pointData.yMin()) / (this.pointData.yMax() - this.pointData.yMin());
    const range = (this.rangeYMax - this.rangeYMin);

    return (distribution * range) + this.rangeYMin;
  }

  /**
   * The canvas that contains the drawn points
   *
   * @return {void}
   * @private
   */
  private createElement(): void {
    const canvas = document.createElement('canvas');
    canvas.id = `persistence_canvas_${this.id}`;

    canvas.classList.add('persistence_canvas', 'hidden');
    canvas.width = this.controlData.settings.canvasWidth;
    canvas.height = this.controlData.settings.canvasHeight;

    const context = <CanvasRenderingContext2D>canvas.getContext('2d');
    context.strokeStyle = this.controlData.settings.strokeStyle;

    this.element = canvas;
    this._context = context;
  }

  /**
   * Draws the persistence line and point chunks
   * @return Promise<void>
   */
  private draw() {
    if (typeof this._context === 'undefined') {
      throw new Error('Canvas Context is undefined');
    }

    const chunks = this.pointData.filteredPointsChunked();

    this.events.dispatch(EventType.PointsCleared);

    this._context.clearRect(0, 0, this.controlData.settings.canvasWidth, this.controlData.settings.canvasHeight);

    this.drawLine();
    this.drawAxes();

    const promises: Promise<void>[] = [];

    chunks.forEach((pointArray, i) => {
      console.debug(`Drawing point chunk ${i + 1} / ${chunks.length}`);
      promises.push(this.drawPoints(pointArray));
    });

    const promiseAll = Promise.all(promises);

    promiseAll.then(() => {
      this.events.dispatch(EventType.PointsDrawn);
    });

    return promiseAll;
  }

  /**
   * Timeout promise used to delay chunk drawing
   */
  private waitFor = () => new Promise((r) => setTimeout(r, this.controlData.settings.waitTime));

  /**
   * Asynchronously draws points on the context
   * @param points {PersistencePointTuple[]}
   * @returns {Promise<void>}
   * @private
   */
  private async drawPoints(points: PersistencePointTuple[]): Promise<void> {
    await this.waitFor();

    points.forEach((point) => {
      if (typeof this._context === 'undefined') {
        throw new Error('Canvas Context is undefined');
      }

      const p1 = {
        x: this.xPos(point.x1),
        y: this.yPos(point.y1),
      };
      const p2 = {
        x: this.xPos(point.x2),
        y: this.yPos(point.y2),
      };

      this._context.beginPath();
      this._context.moveTo(p1.x, p1.y);
      this._context.lineTo(p2.x, p2.y);
      this._context.stroke();
    });
  }

  /**
   * Draws the persistence line from min to max
   * @returns void
   * @private
   */
  private drawLine() {
    if (this.pointData.points.length === 0 || typeof this._context === 'undefined') {
      console.error('Can\'t draw persistence line without points.');
      return;
    }

    const first = this.pointData.points[0];
    const last = this.pointData.points[this.pointData.points.length - 1];

    this.getContext().beginPath();
    this.getContext().moveTo(
      this.xPos(first.x1),
      this.yPos(first.y1),
    );
    this.getContext().lineTo(
      this.xPos(last.x1),
      this.yPos(last.y1),
    );
    this.getContext().stroke();
  }

  private drawAxes() {
    this.getContext().beginPath();
    this.getContext().moveTo(
      this.xPos(0),
      this.yPos(this.pointData.yMax()),
    );
    this.getContext().lineTo(
      this.xPos(0),
      this.yPos(0),
    );
    this.getContext().moveTo(
      this.xPos(0),
      this.yPos(0),
    );
    this.getContext().lineTo(
      this.xPos(this.pointData.xMax()),
      this.yPos(0),
    );
    this.getContext().stroke();
  }

  /**
   * Axis x-range start
   * @returns {number}
   */
  private get rangeXMin() {
    return this.controlData.settings.padding;
  }

  /**
   * Axis x-range end
   * @returns {number}
   */
  private get rangeXMax() {
    return this.controlData.settings.canvasWidth - this.controlData.settings.padding;
  }

  /**
   * Axis y-range start
   * @returns {number}
   */
  private get rangeYMin() {
    return this.controlData.settings.canvasHeight - this.controlData.settings.padding;
  }

  /**
   * Axis y-range end
   * @returns {number}
   */
  private get rangeYMax() {
    return this.controlData.settings.padding;
  }
}
