import PersistencePointTuple from "../point-tuple";
import AbstractControlModule from "./abstract-control-module";
import {IControlData} from "../index";
import {EventType} from "../event-dispatcher";
import {IPointData} from "../point-data-interface";

export default class Renderer extends AbstractControlModule {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    private canvas: HTMLCanvasElement | undefined;

    /**
     * @type {CanvasRenderingContext2D}
     * @private
     */
    private context: CanvasRenderingContext2D | undefined;

    constructor(controlData: IControlData & IPointData) {
        super(controlData);
        this.createElement();
    }

    /**
     * The canvas that contains the drawn points
     *
     * @return {void}
     * @private
     */
    private createElement(): void {
        const canvas = document.createElement('canvas');
        canvas.id = `persistence_canvas_${this.id}`;

        canvas.classList.add('persistence_canvas', 'hidden');
        canvas.width = this.controlData.settings.canvasWidth;
        canvas.height = this.controlData.settings.canvasHeight;

        const context = <CanvasRenderingContext2D>canvas.getContext('2d');
        context.strokeStyle = this.controlData.settings.strokeStyle;

        this.canvas = canvas;
        this.context = context;
    }

    /**
     * Renders pointChunks to canvas
     * @see {pointChunks}
     * @return {Promise<void>}
     */
    update(data: IPointData): Promise<void[]> {
        this.pointData = data;
        (<HTMLCanvasElement>this.canvas).classList.remove('hidden');
        return this._draw();
    }

    /**
     *
     * @return Promise<void>
     */
    _draw() {
        if (typeof this.context === 'undefined') {
            throw new Error('Canvas Context is undefined');
        }

        const chunks = this.pointData.filteredPointsChunked();

        this.events.dispatch(EventType.PointsCleared);

        this.context.clearRect(0, 0, this.controlData.settings.canvasWidth, this.controlData.settings.canvasHeight);

        this._drawLine();

        const promises: Promise<void>[] = [];

        chunks.forEach((pointArray, i) => {
            console.debug(`Drawing point chunk ${i + 1} / ${chunks.length}`);
            promises.push(this._drawPoints(pointArray));
        });

        const promiseAll = Promise.all(promises);

        promiseAll.then(() => {
            this.events.dispatch(EventType.PointsDrawn);
        });

        return promiseAll;
    }

    _waitFor = () => new Promise(r => setTimeout(r, this.controlData.settings.waitTime));

    /**
     * Asynchronously draws points on the context
     * @param points {PersistencePointTuple[]}
     * @returns {Promise<void>}
     * @private
     */
    async _drawPoints(points: PersistencePointTuple[]): Promise<void> {
        await this._waitFor();

        points.forEach(point => {
            if (typeof this.context === 'undefined') {
                throw new Error('Canvas Context is undefined');
            }

            const p1 = {
                x: this.xPos(point.x1),
                y: this.yPos(point.y1)
            };
            const p2 = {
                x: this.xPos(point.x2),
                y: this.yPos(point.y2)
            };

            this.context.beginPath();
            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(p2.x, p2.y);
            this.context.stroke();
        });
    }

    /**
     * Draws the persistence line from min to max
     * @returns void
     * @private
     */
    _drawLine() {
        if (this.pointData.points.length === 0 || typeof this.context === 'undefined') {
            console.error('Can\'t draw persistence line without points.');
            return;
        }

        const first = this.pointData.points[0];
        let last = this.pointData.points[this.pointData.points.length - 1];

        this.context.beginPath();
        this.context.moveTo(
            this.xPos(first.x1),
            this.yPos(first.y1)
        );
        this.context.lineTo(
            this.xPos(last.x1),
            this.yPos(last.y1)
        );
        this.context.stroke();
    }

    /**
     * Axis x-range start
     * @returns {number}
     */
    get rangeXMin() {
        return this.controlData.settings.padding;
    }

    /**
     * Axis x-range end
     * @returns {number}
     */
    get rangeXMax() {
        return this.controlData.settings.canvasWidth - this.controlData.settings.padding;
    }

    /**
     * Axis y-range start
     * @returns {number}
     */
    get rangeYMin() {
        return this.controlData.settings.canvasHeight - this.controlData.settings.padding;
    }

    /**
     * Axis y-range end
     * @returns {number}
     */
    get rangeYMax() {
        return this.controlData.settings.padding;
    }

    /**
     * Maps a point x-position from 0-1 to canvas width
     * @param x {number} Point form 0 - 1
     * @returns {number} Mapped point
     */
    xPos(x: number) {
        return (x - this.controlData.xMin()) / (this.controlData.xMax() - this.controlData.xMin()) * (this.rangeXMax - this.rangeXMin) + this.rangeXMin;
    }

    /**
     * Maps a point y-position from 0-1 to canvas height
     * @param y {number} Point form 0 - 1
     * @returns {number} Mapped point
     */
    yPos(y: number) {
        // Y = (X-A)/(B-A) * (D-C) + C
        // ( (X-A)/(A-B) * (C-D) ) * -1 + D  - Inverse
        // A = Xmin B = Xmax
        // c = Range Min D = range max
        return (y - this.controlData.yMin()) / (this.controlData.yMax() - this.controlData.yMin()) * (this.rangeYMax - this.rangeYMin) + this.rangeYMin;
    }

    public getElement(): HTMLElement {
        return <HTMLElement>this.canvas;
    }
}
