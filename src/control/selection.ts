import AbstractControlModule from "./abstract-control-module";
import {IControlData} from "../index";
import {IPointData} from "../point-data-interface";
import Bounds from "../bounds";

export default class Selection extends AbstractControlModule {
    private element: HTMLElement | undefined;
    private canvas: HTMLCanvasElement | undefined;
    private selectionBounds: Bounds | undefined;
    private selectionStart: number = 0;

    constructor(controlData: IControlData & IPointData) {
        super(controlData);

        this.createElement()
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        (<HTMLCanvasElement>this.canvas) = canvas;

        canvas.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.initSelection(e);
        });

        canvas.addEventListener('mousemove', (e) => {
            this.updateSelection(e);
        });

        canvas.addEventListener('mouseup', (_e)=>{
            this.getSelectionBounds();
            this.pointData.setActiveSelectionBounds(this.selectionBounds);
        });
    }

    public getElement(): HTMLElement {
        return <HTMLElement>this.element;
    }

    update(_data: IPointData): void {
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
    }

    initSelection(event: MouseEvent) {
        const x = (event.clientX - (<HTMLCanvasElement>this.canvas).getBoundingClientRect().left) + (<HTMLCanvasElement>this.canvas).offsetLeft;

        this.selectionStart = event.clientX;

        Object.assign(this.getElement().style, {
            display: 'block',
            width: '0px',
            height: `${(<HTMLCanvasElement>this.canvas).offsetHeight}px`,
            top: `${(<HTMLCanvasElement>this.canvas).offsetTop}px`,
            left: `${x}px`,
        });
    }

    updateSelection(event: MouseEvent) {
        if (event.buttons !== 1) {
            return;
        }

        let style;

        if (event.clientX >= this.selectionStart) {
            this.getElement().style.removeProperty('right');
            style = {
                width: event.clientX - this.getElement().getBoundingClientRect().left + 'px',
                left: `${(this.selectionStart - (<HTMLCanvasElement>this.canvas).getBoundingClientRect().left) + (<HTMLCanvasElement>this.canvas).offsetLeft}px`,
            };
        } else {
            this.getElement().style.removeProperty('left');
            style = {
                width: this.getElement().getBoundingClientRect().right - event.clientX + 'px',
                right: `${((<HTMLCanvasElement>this.canvas).getBoundingClientRect().right - this.selectionStart) + (<HTMLCanvasElement>this.canvas).offsetLeft}px`,
            };
        }

        Object.assign(this.getElement().style, style);
    }

    hideSelection() {
        Object.assign(this.getElement().style, {
            display: 'none',
            width: 0,
        });

        this.selectionBounds = undefined;
    }

    getSelectionBounds() {
        if (this.getElement().style.display === 'none') {
            this.selectionBounds = undefined;
            return;
        }

        const start = Math.max(0, this.getElement().getBoundingClientRect().left - (<HTMLCanvasElement>this.canvas).getBoundingClientRect().left);
        this.selectionBounds = new Bounds(
            start,
            start + this.getElement().getBoundingClientRect().width,
        );
    }
}