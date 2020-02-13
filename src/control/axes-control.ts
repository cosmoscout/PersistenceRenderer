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
      this.renderer.xPos(0),
      this.renderer.yPos(this.pointData.yMax()),
    );
    this.context.lineTo(
      this.renderer.xPos(0),
      this.renderer.yPos(0),
    );

    this.context.moveTo(
      this.renderer.xPos(0),
      this.renderer.yPos(0) - 1,
    );
    this.context.lineTo(
      this.renderer.xPos(this.pointData.xMax()),
      this.renderer.yPos(0) - 1,
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

    for (let i = 0; i <= tickCount; i += 1) {
      const valX = ((this.pointData.xMax() - this.pointData.xMin()) / tickCount) * i;

      let stringX = valX.toFixed(this.controlData.settings.axesTickFractions);
      if (typeof this.controlData.settings.axesTickFormatter === 'function') {
        stringX = this.controlData.settings.axesTickFormatter(valX);
      }

      const measure = this.context.measureText(stringX);

      this.context.beginPath();
      this.context.moveTo(
        this.renderer.xPos(valX),
        this.renderer.yPos(0),
      );
      this.context.lineTo(
        this.renderer.xPos(valX),
        this.renderer.yPos(0) + tickLength,
      );

      this.context.fillText(
        stringX,
        this.renderer.xPos(valX) - measure.width / 2,
        this.renderer.yPos(0) + tickLength + 8,
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
        stringY = this.controlData.settings.axesTickFormatter(valY);
      }

      const measure = this.context.measureText(stringY);

      this.context.beginPath();
      this.context.moveTo(
        this.renderer.xPos(0),
        this.renderer.yPos(valY),
      );
      this.context.lineTo(
        this.renderer.xPos(0) - tickLength,
        this.renderer.yPos(valY),
      );

      this.context.fillText(
        stringY,
        this.renderer.xPos(0) - tickLength - measure.width - 2,
        this.renderer.yPos(valY),
      );

      this.context.stroke();
      this.context.fill();
    }
  }
}
