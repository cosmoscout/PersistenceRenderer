import AbstractControl from './abstract-control';
/**
 * Selection rect for selecting part of points on canvas
 */
export default class SelectionControl extends AbstractControl {
    /**
     * The selection rect element
     */
    private _element;
    /**
     * The current bounds of the selection rect
     */
    private selectionBounds;
    /**
     * Mouse start x-position
     */
    private xStart;
    /**
     * Mouse current x-position
     */
    private xCurrent;
    /**
     * @inheritDoc
     */
    getElement(): HTMLElement;
    /**
     * @inheritDoc
     */
    init(): void;
    /**
       * @inheritDoc
       */
    update(): void;
    /**
       * Internal accessor for the selection element
       * @private
       * @returns {HTMLElement}
       */
    private get element();
    /**
       * Internal accessor for the render canvas
       * @private
       * @returns {HTMLCanvasElement}
       */
    private get canvas();
    /**
       * Resizable rect for point selection
       *
       * @returns {void}
       * @private
       */
    private createElement;
    /**
     * Calculates the selection rect width and left position
     * @returns {void}
     */
    private reCalculateSize;
    /**
     * Adds needed listeners to the canvas and selection rect
     */
    private addListener;
    /**
     * Selection rect initialization
     * Init will be cancelled if position is more than half the canvas padding outside the graph
     * Dispatches 'selectionstart'-event
     * @param event {MouseEvent}
     */
    private mouseDownListener;
    /**
     * Updates the selection rect while mouse is moving
     * Dispatches 'selectionupdating'-event
     * @param event {MouseEvent}
     */
    private mouseMoveListener;
    /**
     * Hides the selection rect after calculating the selection bounds
     */
    private mouseUpListener;
    /**
     * Clears the selection
     * @param event {MouseEvent}
     */
    private clearSelection;
    /**
     * Calculates the selection bounds
     */
    private calculateSelectionBounds;
}
