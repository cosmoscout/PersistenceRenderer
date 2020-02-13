import AbstractControl from './abstract-control';
import { IPointData } from '../point-data-interface';
/**
 * Draws axes on the rendering canvas
 */
export default class AxesControl extends AbstractControl {
    /**
     * Returns canvas from renderer as this control element has no own element
     * @inheritDoc
     */
    getElement(): HTMLElement;
    /**
     * @inheritDoc
     */
    init(): void;
    /**
     * Accessor for render context
     */
    private get context();
    /**
     * Accessor for the rendering instance
     */
    private get renderer();
    /**
     * Draws the x-/y-Axes without ticks
     */
    private drawContainingLines;
    /**
     * Draws all axes and ticks
     * @param data {IPointData}
     */
    update(data: IPointData): any;
    /**
     * X-Axis ticks and values
     * @private
     */
    private xAxisTicks;
    /**
     * Y-Axis ticks and values
     * @private
     */
    private yAxisTicks;
}
