import AbstractControlModule from './abstract-control-module';
import Bounds from '../bounds';
import { EventType } from '../event-dispatcher';

export default class Selection extends AbstractControlModule {
  private element: HTMLElement | undefined;

  private canvas: HTMLCanvasElement | undefined;

  private selectionBounds: Bounds | undefined;

  private selectionStart: number = 0;

  public getElement(): HTMLElement {
    return <HTMLElement> this.element;
  }

  public init(): void {
    this.createElement();
  }

  /**
   * @inheritDoc
   */
  public update(): void {
  }

  /**
   * Resizable rect for point selection
   *
   * @return {void}
   * @private
   */
  private createElement() {
    const selectionRect = document.createElement('div');
    selectionRect.id = `persistence_selection_${this.id}`;

    selectionRect.classList.add('persistence_selection');

    Object.assign(selectionRect.style, {
      backgroundColor: 'rgba(221,221,225,0.8)',
      border: '1px solid #ddf',
      width: '0px',
      height: '0px',
      mixBlendMode: 'difference',
      display: 'none',
      willChange: 'top, left, bottom, right, width, height',
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 1,
    });

    selectionRect.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideSelection();

      this.pointData.setActiveSelectionBounds(this.selectionBounds);
    });

    this.element = selectionRect;
    this.addListener();
  }

  private addListener() {
    this.canvas = <HTMLCanvasElement> this.controlData.renderer.getCanvas();

    (<HTMLCanvasElement> this.canvas).addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.initSelection(e);
    });

    (<HTMLCanvasElement> this.canvas).addEventListener('mousemove', (e) => {
      this.updateSelection(e);
    });

    (<HTMLCanvasElement> this.canvas).addEventListener('mouseup', () => {
      // console.log((<HTMLElement> this.element).offsetWidth);

      if ((<HTMLElement> this.element).offsetWidth < 10) {
        this.hideSelection();
        return;
      }

      this.getSelectionBounds();

      this.pointData.setActiveSelectionBounds(this.selectionBounds);
      this.events.dispatch(EventType.SelectionEnd);
    });
  }

  private initSelection(event: MouseEvent) {
    const x = (event.clientX - (<HTMLCanvasElement> this.canvas).getBoundingClientRect().left)
        + (<HTMLCanvasElement> this.canvas).offsetLeft;

    this.selectionStart = event.clientX;

    Object.assign(this.getElement().style, {
      width: '0px',
      height: `${this.controlData.settings.canvasHeight - this.controlData.settings.padding}px`,
      top: `${(<HTMLCanvasElement> this.canvas).offsetTop}px`,
      left: `${x}px`,
    });

    this.events.dispatch(EventType.SelectionStart);
  }

  private updateSelection(event: MouseEvent) {
    if (event.buttons !== 1) {
      return;
    }

    let style;
    const canvasRect = (<HTMLCanvasElement> this.canvas).getBoundingClientRect();

    if (event.clientX >= this.selectionStart) {
      this.getElement().style.removeProperty('right');
      style = {
        width: `${event.clientX - this.getElement().getBoundingClientRect().left}px`,
        left: `${this.selectionStart - canvasRect.left + (<HTMLCanvasElement> this.canvas).offsetLeft}px`,
      };
    } else {
      this.getElement().style.removeProperty('left');
      style = {
        width: `${this.getElement().getBoundingClientRect().right - event.clientX}px`,
        right: `${canvasRect.right - this.selectionStart + (<HTMLCanvasElement> this.canvas).offsetLeft}px`,
      };
    }

    this.events.dispatch(EventType.SelectionUpdating);

    Object.assign(this.getElement().style, style, {
      display: 'block',
    });
  }

  private hideSelection() {
    Object.assign(this.getElement().style, {
      display: 'none',
      width: 0,
    });

    this.selectionBounds = undefined;
    this.selectionStart = 0;

    this.events.dispatch(EventType.SelectionHidden);
  }

  private getSelectionBounds() {
    if (this.getElement().style.display === 'none') {
      this.selectionBounds = undefined;
      return;
    }

    const start = Math.max(
      0,
      this.getElement().getBoundingClientRect().left - (<HTMLCanvasElement> this.canvas).getBoundingClientRect().left,
    );
    this.selectionBounds = new Bounds(
      start,
      start + this.getElement().getBoundingClientRect().width,
    );
  }
}
