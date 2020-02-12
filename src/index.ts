import PersistencePointTuple from './persistence-point-tuple';
import VtkFileLoader from './loader/vtk-file-loader';
import EventDispatcher, { EventType } from './event-dispatcher';
import { IPointData } from './point-data-interface';
import { ILoader, ILoaderData } from './loader/loader-interface';
import Renderer from './control/renderer';
import AbstractControl from './control/abstract-control';
import PersistenceControl from './control/persistence-control';
import Bounds from './bounds';
import SelectionControl from './control/selection-control';
import { IControlData } from './control-data-interface';
import { IRenderer } from './control/renderer-interface';
import AxesControl from './control/axes-control';
import { DefaultSettings, ISettings } from './settings';

export default class PersistenceRenderer implements IPointData, IControlData {
  /**
   * @type {Element}
   * @private
   */
  private readonly container: Element;

  /**
   * ID added to canvas, slider and selection rect
   * @type {string}
   * @private
   */
  public readonly id: string;

  /**
   * Event dispatcher for the current container
   */
  public readonly events: EventDispatcher;

  /**
   * @see {DefaultSettings}
   * @type {ISettings}
   * @private
   */
  public readonly settings: ISettings = <ISettings>{};

  /**
   * Canvas instance
   * @see {IRenderer}
   */
  private _renderer: IRenderer | undefined;

  /**
   * @see {IPointData}
   */
  private _points: PersistencePointTuple[] | undefined;

  private _pointChunks: PersistencePointTuple[][] | undefined;

  private _bounds: number[] | undefined;

  private _persistenceBounds: Bounds | undefined;

  private _activePersistenceBounds: Bounds | undefined;

  private _activeSelectionBounds: Bounds | undefined;

  /**
   * Instantiated control elements
   */
  private controlElements: AbstractControl[];

  /**
   * Data loader instance
   */
  private loader: ILoader;

  /**
   * @param container {string|HTMLElement} Query selector string or HTMLElement to place everything into
   * @param id {string}
   * @param settings {ISettings}
   * @throws {Error} If dependencies are not loaded
   */
  constructor(container: HTMLElement | string, id: string, settings: ISettings = <ISettings>{}) {
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (element === null) {
        throw new Error(`Element with query selector ${container} not found.`);
      }

      this.container = element;
    } else if (container instanceof HTMLElement) {
      this.container = container;
    } else {
      throw new Error('Container is neither a string nor an instance of HTMLElement.');
    }

    this.id = id;

    Object.assign(this.settings, DefaultSettings, settings);

    this.loader = new VtkFileLoader();
    this.events = new EventDispatcher(this.container);

    this.controlElements = new Array<AbstractControl>();

    this.createControlElements();
  }

  /**
   * Set a different loader instance
   * @param loader {ILoader}
   */
  public setLoader(loader: ILoader) {
    this.loader = loader;
  }

  /**
   * Loads the provided vtk file
   * Chunks points
   * @param fileName {string} Url
   * @returns {Promise<void>}
   */
  public async load(fileName: string): Promise<void> {
    return this.loader.load(fileName).then((data: ILoaderData) => {
      this._points = data.points;
      this._pointChunks = this.chunkPoints(data.points);
      this._bounds = data.bounds;
      this._persistenceBounds = data.persistenceBounds;
      this._activePersistenceBounds = undefined;
      this._activeSelectionBounds = undefined;

      this.events.dispatch(EventType.DataLoaded);
    });
  }

  /**
   * The Renderer instance created by
   * @see {createControlElements}
   */
  public get renderer(): IRenderer {
    return <IRenderer> this._renderer;
  }

  /**
   * Calls update on each instantiated control element
   */
  public update(): void {
    this.controlElements.forEach((element) => {
      element.update(this);
    });
  }

  /**
   * Get the raw Point Tuple array
   */
  public get points(): PersistencePointTuple[] {
    if (typeof this._points === 'undefined') {
      return [];
    }

    return this._points;
  }

  /**
   * Chunked version of
   * @see {points}
   */
  public get pointChunks(): PersistencePointTuple[][] {
    if (typeof this._pointChunks === 'undefined') {
      return [];
    }

    return this._pointChunks;
  }

  /**
   * Get the x/y/z min/max bounds of all points
   * Min/Max will equal to -inf/inf if bounds are not set
   * @returns number[]
   */
  public get bounds(): number[] {
    if (typeof this._bounds === 'undefined') {
      return [
        // X
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,

        // Y
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,

        // Z
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
      ];
    }

    return this._bounds;
  }

  /**
   * Get the lowest/highest persistence bounds computed by all points
   * Bounds will be -inf / inf if no bounds were set
   * @returns {Bounds}
   */
  public get persistenceBounds(): Bounds {
    if (typeof this._persistenceBounds === 'undefined') {
      return new Bounds(
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
      );
    }

    return this._persistenceBounds;
  }

  /**
   * Get the active/selected persistence bounds
   * Bounds will be -inf / inf if no bounds were set
   * @returns {Bounds}
   */
  public get activePersistenceBounds(): Bounds {
    if (typeof this._activePersistenceBounds === 'undefined') {
      return new Bounds(
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
      );
    }

    return this._activePersistenceBounds;
  }

  /**
   * Set the active/selected persistence bounds
   * Calls update after setting
   * @param bounds {Bounds}
   */
  public setActivePersistenceBounds(bounds: Bounds): void {
    this._activePersistenceBounds = bounds;
    this.update();
  }

  /**
   * Get the active selection Bounds
   * Bounds will be -inf / inf if no bounds were set
   * @returns {Bounds}
   */
  public get activeSelectionBounds(): Bounds {
    if (typeof this._activeSelectionBounds === 'undefined') {
      return new Bounds(
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
      );
    }

    return this._activeSelectionBounds;
  }

  /**
   * Set the active selection bounds
   * Calls update after setting
   * @param bounds {Bounds}
   */
  public setActiveSelectionBounds(bounds: Bounds): void {
    this._activeSelectionBounds = bounds;
    this.update();
  }

  /**
   * Bounds x-min
   * @returns {number}
   */
  public xMin() {
    return this.bounds[0];
  }

  /**
   * Bounds x-max
   * @returns {number}
   */
  public xMax() {
    return this.bounds[1];
  }

  /**
   * Bounds y-min
   * @returns {number}
   */
  public yMin() {
    return this.bounds[2];
  }

  /**
   * Bounds y-max
   * @returns {number}
   */
  public yMax() {
    return this.bounds[3];
  }

  /**
   * Filters points by persistence and selection
   * @returns {PersistencePointTuple[]}
   */
  public filteredPoints(): PersistencePointTuple[] {
    if (typeof this.points === 'undefined') {
      return [];
    }

    return this.filterPersistence(this.filterSelection(this.points));
  }

  /**
   * Returns the chunked version of
   * @see {filteredPoints}
   */
  public filteredPointsChunked(): PersistencePointTuple[][] {
    return this.chunkPoints(this.filteredPoints());
  }

  /**
   * Creates all enabled control elements
   */
  private createControlElements(): void {
    const renderer = new Renderer(this);
    renderer.init();

    this.container.appendChild(renderer.getElement());
    this.controlElements.push(renderer);
    this._renderer = renderer;

    if (this.settings.enableSelection) {
      const selection = new SelectionControl(this);
      selection.init();
      this.container.appendChild(selection.getElement());
      this.controlElements.push(selection);
    }

    if (this.settings.enableSlider) {
      const slider = new PersistenceControl(this);
      slider.init();
      this.container.appendChild(slider.getElement());
      this.controlElements.push(slider);
    }

    if (this.settings.enableAxes) {
      const axes = new AxesControl(this);
      axes.init();
      this.controlElements.push(axes);
    }
  }

  /**
   * Returns filtered points in selection rect area
   * @param points {PersistencePointTuple[]}
   * @returns {PersistencePointTuple[]}
   */
  private filterSelection(points: PersistencePointTuple[]) {
    if (typeof this._renderer === 'undefined') {
      return points;
    }

    return points.filter((point) => (<Renderer> this._renderer).xPos(point.lower.x) >= this.activeSelectionBounds.min
        && (<Renderer> this._renderer).xPos(point.lower.x) <= this.activeSelectionBounds.max);
  }

  /**
   * Returns filtered points with persistence >= slider values <=
   * @param points
   * @returns {PersistencePointTuple[]}
   * @private
   */
  private filterPersistence(points: PersistencePointTuple[]) {
    return points.filter((point) => point.persistence >= Number(this.activePersistenceBounds.min)
        && point.persistence <= Number(this.activePersistenceBounds.max));
  }

  /**
   * Chunks vtk points into buckets of size _chunks
   * @returns {PersistencePointTuple[][]}
   * @private
   */
  private chunkPoints(points: PersistencePointTuple[]) {
    return points.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / this.settings.chunks);

      if (!resultArray[chunkIndex]) {
        // eslint-disable-next-line no-param-reassign
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, <PersistencePointTuple[][]>[]);
  }
}
