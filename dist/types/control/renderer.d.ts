import AbstractControlModule from './abstract-control-module';
import { IPointData } from '../point-data-interface';
import IRenderer from './renderer-interface';
/**
 * Point renderer
 */
export default class Renderer extends AbstractControlModule implements IRenderer {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    private element;
    /**
     * @type {CanvasRenderingContext2D}
     * @private
     */
    private _context;
    /**
     * The canvas that contains the drawn points
     *
     * @return {void}
     * @private
     */
    protected createElement(): void;
    /**
     * Canvas Rendering context created in
     * @see {createElement}
     * @return {CanvasRenderingContext2D}
     */
    getContext(): CanvasRenderingContext2D;
    /**
     * Renders pointChunks to canvas
     * @see {pointChunks}
     * @return {Promise<void>}
     */
    update(data: IPointData): Promise<void[]>;
    /**
     * @inheritDoc
     */
    getElement(): HTMLElement;
    /**
     * Drawing canvas
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * Maps a point x-position from 0-1 to canvas width
     * @param x {number} Point form 0 - 1
     * @returns {number} Mapped point
     */
    xPos(x: number): number;
    /**
     * Maps a point y-position from 0-1 to canvas height
     * @param y {number} Point form 0 - 1
     * @returns {number} Mapped point
     */
    yPos(y: number): number;
    /**
     * Draws the persistence line and point chunks
     * @return Promise<void>
     */
    private draw;
    /**
     * Timeout promise used to delay chunk drawing
     */
    private waitFor;
    /**
     * Asynchronously draws points on the context
     * @param points {PersistencePointTuple[]}
     * @returns {Promise<void>}
     * @private
     */
    private drawPoints;
    /**
     * Draws the persistence line from min to max
     * @returns void
     * @private
     */
    private drawLine;
    /**
     * Axis x-range start
     * @returns {number}
     */
    private get rangeXMin();
    /**
     * Axis x-range end
     * @returns {number}
     */
    private get rangeXMax();
    /**
     * Axis y-range start
     * @returns {number}
     */
    private get rangeYMin();
    /**
     * Axis y-range end
     * @returns {number}
     */
    private get rangeYMax();
}
