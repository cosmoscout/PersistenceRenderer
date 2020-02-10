import PersistencePointTuple from "./point-tuple";
import VtkFileLoader from "./loader/vtk-file-loader";
import EventDispatcher, {EventType} from "./event-dispatcher";
import {IPointData} from "./point-data-interface";
import {ILoader, ILoaderData} from "./loader/loader-interface";
import Renderer from "./control/renderer";
import AbstractControlModule from "./control/abstract-control-module";
import PersistenceSlider from "./control/slider";
import Bounds from "./bounds";
import {DefaultSettings, Settings} from "./settings";
import Selection from "./control/selection";

export interface IControlData {
    readonly id: string;
    readonly events: EventDispatcher;
    readonly settings: Settings;

    xMin(): number;

    xMax(): number;

    yMin(): number;

    yMax(): number;
}

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
     * @see {DefaultSettings}
     * @type {Settings}
     * @private
     */
    public readonly settings: Settings = <Settings>{};

    private _points: PersistencePointTuple[] | undefined;
    private _pointChunks: PersistencePointTuple[][] | undefined;
    private _bounds: number[] | undefined;
    private _persistenceBounds: Bounds | undefined;
    private _activePersistenceBounds: Bounds | undefined;
    private _activeSelectionBounds: Bounds | undefined;

    private controlElements: AbstractControlModule[];

    private loader: ILoader;
    public readonly events: EventDispatcher;


    /**
     * @param container {string|HTMLElement} Query selector string or HTMLElement to place everything into
     * @param id {string}
     * @param settings {Settings}
     * @throws {Error} If dependencies are not loaded
     */
    constructor(container: HTMLElement | string, id: string, settings: Settings) {
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

        this.controlElements = new Array<AbstractControlModule>();

        this.createControlElements();
    }

    public setLoader(loader: ILoader) {
        this.loader = loader;
    }

    private createControlElements(): void {
        const renderer = new Renderer(this);
        this.container.appendChild(renderer.getElement());
        this.controlElements.push(renderer);

        if (this.settings.enableSelection) {
            const selection = new Selection(this);
            selection.setCanvas(<HTMLCanvasElement>renderer.getElement());
            this.container.appendChild(selection.getElement());
            this.controlElements.push(selection);
        }

        if (this.settings.enableSlider) {
            const slider = new PersistenceSlider(this);
            this.container.appendChild(slider.getElement());
            this.controlElements.push(slider);
        }
    }

    public get points(): PersistencePointTuple[] {
        if (typeof this._points === 'undefined') {
            return [];
        }

        return this._points;
    }

    public get pointChunks(): PersistencePointTuple[][] {
        if (typeof this._pointChunks === 'undefined') {
            return [];
        }

        return this._pointChunks;
    }

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

    public get persistenceBounds(): Bounds {
        if (typeof this._persistenceBounds === 'undefined') {
            return new Bounds(
                Number.NEGATIVE_INFINITY,
                Number.POSITIVE_INFINITY,
            );
        }

        return this._persistenceBounds;
    }

    public get activePersistenceBounds(): Bounds {
        if (typeof this._activePersistenceBounds === 'undefined') {
            return new Bounds(
                Number.NEGATIVE_INFINITY,
                Number.POSITIVE_INFINITY,
            );
        }

        return this._activePersistenceBounds;
    }

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
     * Loads the provided vtk file
     * Chunks points
     * @param fileName {string} Url
     * @returns {Promise<void>}
     */
    public async load(fileName: string): Promise<void> {
        await this.loader.load(fileName).then((data: ILoaderData) => {
            this._points = data.points;
            this._pointChunks = this.chunkPoints(data.points);
            this._bounds = data.bounds;
            this._persistenceBounds = data.persistenceBounds;
            this._activePersistenceBounds = undefined;
            this._activeSelectionBounds = undefined;

            this.events.dispatch(EventType.DataLoaded);
        });
    }

    public render(): void {
        this.controlElements.forEach(element => {
            element.update(this);
        });
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
     * @return {PersistencePointTuple[]}
     */
    public filteredPoints(): PersistencePointTuple[] {
        if (typeof this.points === 'undefined') {
            return [];
        }

        return this.filterPersistence(this.filterSelection(this.points));
    }

    public filteredPointsChunked(): PersistencePointTuple[][] {
        return this.chunkPoints(this.filteredPoints());
    }

    /**
     * Returns filtered points in selection rect area
     * @param points {PersistencePointTuple[]}
     * @return {PersistencePointTuple[]}
     */
    private filterSelection(points: PersistencePointTuple[]) {
        const xPos = (x:number) => {
            return (x - this.xMin()) / (this.xMax() - this.xMin()) * (this.settings.canvasWidth - this.settings.padding - this.settings.padding) + this.settings.padding;
        };

        return points.filter(point => xPos(point.x1) >= this.activeSelectionBounds.min && xPos(point.x1) <= this.activeSelectionBounds.max);
    }

    /**
     * Returns filtered points with persistence >= slider values <=
     * @param points
     * @return {PersistencePointTuple[]}
     * @private
     */
    private filterPersistence(points: PersistencePointTuple[]) {
        return points.filter(point => {
            return point.persistence >= Number(this.activePersistenceBounds.min) && point.persistence <= Number(this.activePersistenceBounds.max);
        });
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
                resultArray[chunkIndex] = [] // start a new chunk
            }

            resultArray[chunkIndex].push(item);

            return resultArray;
        }, <PersistencePointTuple[][]>[]);
    }

    public setActivePersistenceBounds(bounds: Bounds): void {
        this._activePersistenceBounds = bounds;
        this.render();
    }

    public setActiveSelectionBounds(bounds: Bounds): void {
        this._activeSelectionBounds = bounds;
        this.render();
    }
}
