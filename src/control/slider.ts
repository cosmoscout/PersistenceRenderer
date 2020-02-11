import noUiSlider from 'nouislider';
import AbstractControlModule from './abstract-control-module';
import { EventType } from '../event-dispatcher';
import { IPointData } from '../point-data-interface';
import Bounds from '../bounds';

/**
 * Persistence Bounds Control Slider
 */
export default class PersistenceSlider extends AbstractControlModule {
  /**
   * @type {HTMLElement}
   * @private
   */
  private element: HTMLElement | undefined;

  /**
   * @type {Bounds}
   * @private
   */
  private selectedPersistenceBounds: Bounds | undefined;

  /**
   * Current noUiSlider instance
   * @type {noUiSlider.noUiSlider}
   * @private
   */
  private noUiSlider: noUiSlider.noUiSlider | undefined;

  /**
   * @inheritDoc
   */
  public getElement(): HTMLElement {
    return <HTMLElement> this.element;
  }

  public init(): void {
    this.createElement();
  }

  /**
   * Creates a two-handled slider for given persistence bounds
   * Update exits early if current selected bounds and selected bounds in IPointData equal
   */
  public update(data: IPointData): void {
    if (typeof this.selectedPersistenceBounds !== 'undefined'
        && this.selectedPersistenceBounds.equals(data.activePersistenceBounds)) {
      return;
    }

    this.pointData = data;
    const { element } = this;

    if (typeof this.noUiSlider !== 'undefined') {
      this.noUiSlider.destroy();
      this.selectedPersistenceBounds = undefined;
      this.events.dispatch(EventType.SliderDestroyed);
    }

    noUiSlider.create(<HTMLElement>element, {
      start: [data.persistenceBounds.min, data.persistenceBounds.max],
      snap: false,
      animate: false,
      connect: true,
      range: <{}>data.persistenceBounds,
    });
    this.events.dispatch(EventType.SliderCreated);

    // @ts-ignore
    this.noUiSlider = element.noUiSlider;

    this.addListener();
  }

  /**
   * Creates the actual noUiSlider container
   */
  private createElement() {
    if (typeof (<any>window).noUiSlider === 'undefined') {
      throw new Error('noUiSlider is required');
    }

    const slider = document.createElement('div');
    slider.id = `persistence_slider_${this.id}`;

    slider.classList.add('persistence_slider');

    this.element = slider;
  }

  /**
   * Adds all needed event listeners to the slider instance
   */
  private addListener() {
    if (typeof this.noUiSlider === 'undefined') {
      console.error('Trying to add event listeners to non existing noUiSlider.');
      return;
    }

    this.noUiSlider.on('update', (values: number[]) => {
      this.selectedPersistenceBounds = new Bounds(
        values[0],
        values[1],
      );

      this.events.dispatch(EventType.PersistenceBoundsUpdating, this.selectedPersistenceBounds);
    });

    this.noUiSlider.on('set', (values: number[]) => {
      this.selectedPersistenceBounds = new Bounds(
        values[0],
        values[1],
      );

      this.events.dispatch(EventType.PersistenceBoundsSet, this.selectedPersistenceBounds);
      this.pointData.setActivePersistenceBounds(this.selectedPersistenceBounds);
    });
  }
}
