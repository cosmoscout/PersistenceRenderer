import AbstractControl from './abstract-control';
import Bounds from '../bounds';
import { EventType } from '../event-dispatcher';

/**
 * Very much @TODO
 */
export default class SelectionControl extends AbstractControl {
  private element: HTMLElement | undefined;

  private canvas: HTMLCanvasElement | undefined;

  private selectionBounds: Bounds | undefined;

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
   * @returns {void}
   * @private
   */
  private createElement() {
    const selectionRect = document.createElement('div');
    selectionRect.hidden = true;
    selectionRect.id = `persistence_selection_${this.id}`;

    selectionRect.classList.add('persistence_selection');

    Object.assign(selectionRect.style, {
      backgroundColor: 'rgba(221,221,225,0.8)',
      border: '1px solid #ddf',
      width: '0px',
      height: '0px',
      mixBlendMode: 'difference',
      // display: 'none',
      willChange: 'top, left, bottom, right, width, height',
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 1,
      boxSizing: 'border-box',
    });

    this.element = selectionRect;

    this.addListener();
  }

  private addListener() {
    this.canvas = <HTMLCanvasElement> this.controlData.renderer.getCanvas();
    let x1 = 0; let
      x2 = 0;
    const reCalc = () => {
      const x3 = Math.min(x1, x2);
      const x4 = Math.max(x1, x2);

      const height = (<HTMLElement> this.canvas).offsetHeight - this.controlData.settings.getPadding('bottom') - 7;

      (<HTMLElement> this.element).style.left = `${x3}px`;
      (<HTMLElement> this.element).style.top = `${(<HTMLElement> this.canvas).offsetTop + 5}px`;
      (<HTMLElement> this.element).style.width = `${x4 - x3}px`;
      (<HTMLElement> this.element).style.height = `${height}px`;
    };

    (<HTMLCanvasElement> this.canvas).onmousedown = (e) => {
      (<HTMLElement> this.element).hidden = false;
      this.events.dispatch(EventType.SelectionStart);
      x1 = e.clientX;
      reCalc();
    };

    (<HTMLCanvasElement> this.canvas).onmousemove = (e) => {
      this.events.dispatch(EventType.SelectionUpdating);
      x2 = e.clientX;
      reCalc();
    };

    (<HTMLElement> this.element).onmousemove = (e) => {
      this.events.dispatch(EventType.SelectionUpdating);
      x2 = e.clientX;
      reCalc();
    };

    (<HTMLCanvasElement> this.canvas).onmouseup = () => {
      this.getSelectionBounds();

      this.pointData.setActiveSelectionBounds(this.selectionBounds);
      this.events.dispatch(EventType.SelectionEnd);
      (<HTMLElement> this.element).hidden = true;
    };

    (<HTMLElement> this.element).onmouseup = () => {
      this.getSelectionBounds();

      this.pointData.setActiveSelectionBounds(this.selectionBounds);
      this.events.dispatch(EventType.SelectionEnd);
      (<HTMLElement> this.element).hidden = true;
    };
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
