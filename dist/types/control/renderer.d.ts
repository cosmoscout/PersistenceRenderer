import AbstractControl from './abstract-control';
import { IPointData } from '../point-data-interface';
import { IRenderer, PointDrawFunction } from './renderer-interface';
/**
 * Point renderer
 */
export default class Renderer extends AbstractControl implements IRenderer {
    /**
     * Canvas Element
     * @type {HTMLCanvasElement}
     * @private
     */
    private element;
    /**
     * Canvas drawing context
     * @type {CanvasRenderingContext2D}
     * @private
     */
    private _context;
    /**
     * Renders points to canvas
     * @see {pointChunks}
     * @returns {Promise<void>}
     */
    update(data: IPointData): Promise<void[]>;
    /**
     * Creates the canvas element
     */
    init(): void;
    /**
     * Canvas Rendering context created in
     * @see {createElement}
     * @returns {CanvasRenderingContext2D}
     */
    getContext(): CanvasRenderingContext2D;
    /**
     * @inheritDoc
     */
    getElement(): HTMLElement;
    /**
     * Drawing canvas
     * @returns {HTMLCanvasElement}
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
     * The default point draw function
     * Draws a line from lower to upper
     *
     * @param point {PersistencePointTuple}
     * @param renderer {IRenderer}
     */
    readonly defaultDrawFunction: PointDrawFunction;
    /**
     * Creates the canvas that contains the drawn points
     *
     * @returns {void}
     * @private
     */
    private createElement;
    /**
     * Draws the persistence line and point chunks
     * @returns Promise<void[]>
     *     @throws {Error} If canvas context is undefined
     * @private
     */
    private draw;
    /**
     * Timeout promise used to delay chunk drawing
     * @returns {Promise<void>}
     * @private
     */
    private waitFor;
    /**
     * Returns either the default draw fn or a custom one from settings
     */
    private getPointDrawFunction;
    /**
     * Asynchronously draws points on the context
     * @param points {PersistencePointTuple[]}
     * @param i {number} Current chunk index
     * @returns {Promise<void>}
     * @throws {Error} If canvas context is undefined
     * @private
     */
    private drawPoints;
    /**
     * Draws the persistence line from min to max
     * @returns void
     * @throws {Error} If point data is empty or context is undefined
     * @private
     */
    private drawPersistenceLine;
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
