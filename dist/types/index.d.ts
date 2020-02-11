import PersistencePointTuple from './point-tuple';
import EventDispatcher from './event-dispatcher';
import { IPointData } from './point-data-interface';
import { ILoader } from './loader/loader-interface';
import Renderer from './control/renderer';
import Bounds from './bounds';
import { Settings } from './settings';
import { IControlData } from './control-data-interface';
export default class PersistenceRenderer implements IPointData, IControlData {
    /**
     * @type {Element}
     * @private
     */
    private readonly container;
    /**
     * ID added to canvas, slider and selection rect
     * @type {string}
     * @private
     */
    readonly id: string;
    /**
     * Event dispatcher for the current container
     */
    readonly events: EventDispatcher;
    /**
     * @see {DefaultSettings}
     * @type {Settings}
     * @private
     */
    readonly settings: Settings;
    /**
     * Canvas instance
     * @see {Renderer}
     */
    private _renderer;
    /**
     * @see {IPointData}
     */
    private _points;
    private _pointChunks;
    private _bounds;
    private _persistenceBounds;
    private _activePersistenceBounds;
    private _activeSelectionBounds;
    /**
     * Instantiated control elements
     */
    private controlElements;
    /**
     * Data loader instance
     */
    private loader;
    /**
     * @param container {string|HTMLElement} Query selector string or HTMLElement to place everything into
     * @param id {string}
     * @param settings {Settings}
     * @throws {Error} If dependencies are not loaded
     */
    constructor(container: HTMLElement | string, id: string, settings: Settings);
    /**
     * Set a different loader instance
     * @param loader {ILoader}
     */
    setLoader(loader: ILoader): void;
    /**
     * Loads the provided vtk file
     * Chunks points
     * @param fileName {string} Url
     * @returns {Promise<void>}
     */
    load(fileName: string): Promise<void>;
    /**
     * The Renderer instance created by
     * @see {createControlElements}
     */
    get renderer(): Renderer;
    /**
     * Calls update on each instantiated control element
     */
    update(): void;
    /**
     * Get the raw Point Tuple array
     */
    get points(): PersistencePointTuple[];
    /**
     * Chunked version of
     * @see {points}
     */
    get pointChunks(): PersistencePointTuple[][];
    /**
     * Get the x/y/z min/max bounds of all points
     * Min/Max will equal to -inf/inf if bounds are not set
     * @returns number[]
     */
    get bounds(): number[];
    /**
     * Get the lowest/highest persistence bounds computed by all points
     * Bounds will be -inf / inf if no bounds were set
     * @returns {Bounds}
     */
    get persistenceBounds(): Bounds;
    /**
     * Get the active/selected persistence bounds
     * Bounds will be -inf / inf if no bounds were set
     * @returns {Bounds}
     */
    get activePersistenceBounds(): Bounds;
    /**
     * Set the active/selected persistence bounds
     * Calls update after setting
     * @param bounds {Bounds}
     */
    setActivePersistenceBounds(bounds: Bounds): void;
    /**
     * Get the active selection Bounds
     * Bounds will be -inf / inf if no bounds were set
     * @returns {Bounds}
     */
    get activeSelectionBounds(): Bounds;
    /**
     * Set the active selection bounds
     * Calls update after setting
     * @param bounds {Bounds}
     */
    setActiveSelectionBounds(bounds: Bounds): void;
    /**
     * Bounds x-min
     * @returns {number}
     */
    xMin(): number;
    /**
     * Bounds x-max
     * @returns {number}
     */
    xMax(): number;
    /**
     * Bounds y-min
     * @returns {number}
     */
    yMin(): number;
    /**
     * Bounds y-max
     * @returns {number}
     */
    yMax(): number;
    /**
     * Filters points by persistence and selection
     * @return {PersistencePointTuple[]}
     */
    filteredPoints(): PersistencePointTuple[];
    /**
     * Returns the chunked version of
     * @see {filteredPoints}
     */
    filteredPointsChunked(): PersistencePointTuple[][];
    /**
     * Creates all enabled control elements
     */
    private createControlElements;
    /**
     * Returns filtered points in selection rect area
     * @param points {PersistencePointTuple[]}
     * @return {PersistencePointTuple[]}
     */
    private filterSelection;
    /**
     * Returns filtered points with persistence >= slider values <=
     * @param points
     * @return {PersistencePointTuple[]}
     * @private
     */
    private filterPersistence;
    /**
     * Chunks vtk points into buckets of size _chunks
     * @returns {PersistencePointTuple[][]}
     * @private
     */
    private chunkPoints;
}
