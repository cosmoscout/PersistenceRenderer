import AbstractControl from './abstract-control';
import Bounds from '../bounds';
import { EventType } from '../event-dispatcher';

/**
 * Selection rect for selecting part of points on canvas
 */
export default class SelectionControl extends AbstractControl {
  /**
   * The selection rect element
   */
  private _element: HTMLElement | undefined;

  /**
   * The current bounds of the selection rect
   */
  private selectionBounds: Bounds | undefined;

  /**
   * Mouse start x-position
   */
  private xStart: number = 0;

  /**
   * Mouse current x-position
   */
  private xCurrent: number = 0;

  /**
   * @inheritDoc
   */
  public getElement(): HTMLElement {
    return <HTMLElement> this._element;
  }

  /**
   * @inheritDoc
   */
  public init(): void {
    this.createElement();
  }

  /**
     * @inheritDoc
     */
  public update(): void {
  }

  /**
     * Internal accessor for the selection element
     * @private
     * @returns {HTMLElement}
     */
  private get element(): HTMLElement {
    if (typeof this._element === 'undefined') {
      throw new Error('Selection Control element is undefined.');
    }

    return this._element;
  }

  /**
     * Internal accessor for the render canvas
     * @private
     * @returns {HTMLCanvasElement}
     */
  private get canvas(): HTMLCanvasElement {
    return this.controlData.renderer.getCanvas();
  }

  /**
     * Resizable rect for point selection
     *
     * @returns {void}
     * @private
     */
  private createElement() {
    const selectionRect = document.createElement('div');
    selectionRect.hidden = true;
    selectionRect.id = `persistence_selection_${this.id}`;

    selectionRect.classList.add('persistence_selection');

    this.controlData.container.style.position = 'relative';

    Object.assign(selectionRect.style, {
      backgroundColor: 'rgba(221,221,225,0.8)',
      border: '1px solid #ddf',
      width: '0',
      height: '0',
      mixBlendMode: 'difference',
      willChange: 'top, left, width, height',
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 1,
      boxSizing: 'border-box',
    });

    this._element = selectionRect;

    this.addListener();
  }

  /**
   * Calculates the selection rect width and left position
   * @returns {void}
   */
  private reCalculateSize(): void {
    const left = Math.min(this.xStart, this.xCurrent);
    const width = Math.max(this.xStart, this.xCurrent);

    const height = this.controlData.settings.canvasHeight
            - this.controlData.settings.getPadding('top')
            - this.controlData.settings.getPadding('bottom');

    this.element.style.left = `${left}px`;
    this.element.style.top = `${this.canvas.offsetTop + this.controlData.settings.getPadding('top')}px`;
    this.element.style.width = `${width - left}px`;
    this.element.style.height = `${height}px`;
  }

  /**
   * Adds needed listeners to the canvas and selection rect
   */
  private addListener() {
    this.canvas.addEventListener('mousedown', this.mouseDownListener.bind(this));

    this.canvas.addEventListener('mousemove', this.mouseMoveListener.bind(this));
    this.element.addEventListener('mousemove', this.mouseMoveListener.bind(this));

    this.canvas.addEventListener('mouseup', this.mouseUpListener.bind(this));
    this.element.addEventListener('mouseup', this.mouseUpListener.bind(this));

    this.canvas.addEventListener('contextmenu', this.clearSelection.bind(this));
    this.element.addEventListener('contextmenu', this.clearSelection.bind(this));
  }

  /**
   * Selection rect initialization
   * Init will be cancelled if position is more than half the canvas padding outside the graph
   * Dispatches 'selectionstart'-event
   * @param event {MouseEvent}
   */
  private mouseDownListener(event: MouseEvent): void {
    if (this.controlData.settings.selectionStopPropagation) {
      event.stopPropagation();
    }

    this.xStart = event.clientX - this.canvas.getBoundingClientRect().left;

    if (this.xStart < this.controlData.settings.getPadding('left') / 2) {
      return;
    }

    this.element.hidden = false;
    this.events.dispatch(EventType.SelectionStart);
    this.reCalculateSize();
  }

  /**
   * Updates the selection rect while mouse is moving
   * Dispatches 'selectionupdating'-event
   * @param event {MouseEvent}
   */
  private mouseMoveListener(event: MouseEvent): void {
    this.events.dispatch(EventType.SelectionUpdating);
    this.xCurrent = event.clientX - this.canvas.getBoundingClientRect().left;
    this.reCalculateSize();
  }

  /**
   * Hides the selection rect after calculating the selection bounds
   */
  private mouseUpListener(): void {
    this.calculateSelectionBounds();

    this.element.hidden = true;

    if (typeof this.selectionBounds !== 'undefined'
        && this.selectionBounds.width < this.controlData.settings.selectionMinWidth) {
      return;
    }

    this.pointData.setActiveSelectionBounds(this.selectionBounds);
    this.events.dispatch(EventType.SelectionEnd);
  }

  /**
   * Clears the selection
   * @param event {MouseEvent}
   */
  private clearSelection(event: MouseEvent): void {
    event.preventDefault();
    this.pointData.setActiveSelectionBounds(undefined);
  }

  /**
   * Calculates the selection bounds
   */
  private calculateSelectionBounds() {
    if (this.getElement().hidden) {
      this.selectionBounds = undefined;
      return;
    }

    const start = Math.max(
      0,
      this.element.getBoundingClientRect().left - this.canvas.getBoundingClientRect().left,
    );

    this.selectionBounds = new Bounds(
      start,
      start + this.element.getBoundingClientRect().width,
    );
  }
}
