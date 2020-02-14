import AbstractControl from './abstract-control';
import { IPointData } from '../point-data-interface';
import { IRenderer } from './renderer-interface';

/**
 * Draws axes on the rendering canvas
 */
export default class AxesControl extends AbstractControl {
  /**
   * Returns canvas from renderer as this control element has no own element
   * @inheritDoc
   */
  public getElement(): HTMLElement {
    return <HTMLElement> this.controlData.renderer.getCanvas();
  }

  /**
   * @inheritDoc
   */
  public init(): void {
    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
  }

  /**
   * Accessor for render context
   */
  private get context(): CanvasRenderingContext2D {
    return this.renderer.getContext();
  }

  /**
   * Accessor for the rendering instance
   */
  private get renderer(): IRenderer {
    return this.controlData.renderer;
  }

  /**
   * Draws the x-/y-Axes without ticks
   */
  private drawContainingLines(): void {
    this.context.strokeStyle = this.controlData.settings.axesColor;

    this.context.beginPath();
    this.context.moveTo(
      this.controlData.settings.getPadding('left'),
      this.renderer.yPos(this.pointData.yMax()),
    );
    this.context.lineTo(
        this.controlData.settings.getPadding('left'),
      this.renderer.yPos(0),
    );

    this.context.moveTo(
        this.controlData.settings.getPadding('left'),
      this.renderer.yPos(0),
    );
    this.context.lineTo(
      this.renderer.xPos(this.pointData.xMaxFiltered()),
      this.renderer.yPos(0),
    );
    this.context.stroke();
  }

  /**
   * Draws all axes and ticks
   * @param data {IPointData}
   */
  public update(data: IPointData): any {
    this.context.save();

    this.context.fillStyle = this.controlData.settings.axesTextColor;

    this.pointData = data;

    this.drawContainingLines();

    this.context.strokeStyle = this.controlData.settings.axesTickColor;

    this.xAxisTicks();
    this.yAxisTicks();

    this.context.restore();
  }

  /**
   * X-Axis ticks and values
   * @private
   */
  private xAxisTicks(): void {
    const tickCount = (typeof this.controlData.settings.axesTickCount === 'number')
      ? this.controlData.settings.axesTickCount
      : this.controlData.settings.axesTickCount[0];

    const tickLength = (typeof this.controlData.settings.axesTickLength === 'number')
      ? this.controlData.settings.axesTickLength
      : this.controlData.settings.axesTickLength[0];

    const low = this.pointData.xMinFiltered();
    const high = this.pointData.xMaxFiltered();
    const diff = high - low;
    const partition = diff / tickCount;

    for (let i = 0; i <= tickCount; i += 1) {
      let valX = ((partition) * i)+low;

      let stringX = valX.toFixed(this.controlData.settings.axesTickFractions);
      if (typeof this.controlData.settings.axesTickFormatter === 'function') {
        stringX = this.controlData.settings.axesTickFormatter(valX, Math.max(0, ((partition) * i-1)+low));
      }

      const measure = this.context.measureText(stringX);



      const map = (value: number, x1: number, y1: number, x2: number, y2: number) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
let t = valX;
      valX = map(
          valX,
          this.pointData.xMinFiltered(),
          this.pointData.xMaxFiltered(),
          this.controlData.settings.getPadding('left'),
          this.controlData.settings.canvasWidth - this.controlData.settings.getPadding('right')
      );

      console.log(`X-Pos for ${t}: ${(valX)}`, this.pointData.xMinFiltered(), this.pointData.xMaxFiltered());

      this.context.beginPath();
      this.context.moveTo(
          valX,
        this.controlData.settings.canvasHeight - this.controlData.settings.getPadding('bottom'),
      );
      this.context.lineTo(
          valX,
          this.controlData.settings.canvasHeight - this.controlData.settings.getPadding('bottom') + tickLength,
      );

      this.context.fillText(
        stringX,
          valX - measure.width / 2,
          this.controlData.settings.canvasHeight - this.controlData.settings.getPadding('bottom') + tickLength + 8,
      );

      this.context.stroke();
      this.context.fill();
    }
  }

  /**
   * Y-Axis ticks and values
   * @private
   */
  private yAxisTicks(): void {
    const tickCount = (typeof this.controlData.settings.axesTickCount === 'number')
      ? this.controlData.settings.axesTickCount
      : this.controlData.settings.axesTickCount[1];

    const tickLength = (typeof this.controlData.settings.axesTickLength === 'number')
      ? this.controlData.settings.axesTickLength
      : this.controlData.settings.axesTickLength[1];

    for (let i = 0; i <= tickCount; i += 1) {
      const valY = ((this.pointData.yMax() - this.pointData.yMin()) / tickCount) * i;

      let stringY = valY.toFixed(this.controlData.settings.axesTickFractions);
      if (typeof this.controlData.settings.axesTickFormatter === 'function') {
        stringY = this.controlData.settings.axesTickFormatter(valY, 0);
      }

      const measure = this.context.measureText(stringY);

      this.context.beginPath();
      this.context.moveTo(
          this.controlData.settings.getPadding('left'),
        this.renderer.yPos(valY),
      );
      this.context.lineTo(
          this.controlData.settings.getPadding('left') - tickLength,
        this.renderer.yPos(valY),
      );

      this.context.fillText(
        stringY,
          this.controlData.settings.getPadding('left') - tickLength - measure.width - 2,
        this.renderer.yPos(valY),
      );

      this.context.stroke();
      this.context.fill();
    }
  }
}
