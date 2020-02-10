import noUiSlider from "nouislider";
import AbstractControlModule from "./abstract-control-module";
import {IControlData} from "../index";
import {EventType} from "../event-dispatcher";
import {IPointData} from "../point-data-interface";
import Bounds from "../bounds";

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

    constructor(controlData: IControlData & IPointData) {
        super(controlData);

        if (typeof (<any>window).noUiSlider === 'undefined') {
            throw new Error('noUiSlider is required');
        }

        this.createElement()
    }

    /**
     * Creates a two-handled slider for computed persistence bounds
     */
    update(data: IPointData): void {
        if (typeof this.selectedPersistenceBounds !== 'undefined' && this.selectedPersistenceBounds.equals(data.activePersistenceBounds)) {
            return;
        }

        this.pointData = data;
        const {element} = this;

        //@ts-ignore
        if (typeof element.noUiSlider !== 'undefined') {
            //@ts-ignore
            element.noUiSlider.destroy();
            this.selectedPersistenceBounds = undefined;
            this.events.dispatch(EventType.SliderDestroyed);
        }

        noUiSlider.create(<HTMLElement>element, {
            start: [data.persistenceBounds.min, data.persistenceBounds.max],
            snap: false,
            animate: false,
            connect: true,
            // @ts-ignore
            range: data.persistenceBounds,
        });
        this.events.dispatch(EventType.SliderCreated);

        //@ts-ignore
        element.noUiSlider.on('update', (values: number[]) => {
            this.selectedPersistenceBounds = new Bounds(
                values[0],
                values[1],
            );

            this.events.dispatch(EventType.PersistenceBoundsUpdating, this.selectedPersistenceBounds);
        });

        //@ts-ignore
        element.noUiSlider.on('set', (values: number[]) => {
            this.selectedPersistenceBounds = new Bounds(
                values[0],
                values[1],
            );

            this.events.dispatch(EventType.PersistenceBoundsSet, this.selectedPersistenceBounds);
            this.pointData.setActivePersistenceBounds(this.selectedPersistenceBounds);
        });
    }

    private createElement() {
        const slider = document.createElement('div');
        slider.id = `persistence_slider_${this.id}`;

        slider.classList.add('persistence_slider');

        this.element = slider;
    }

    public getElement(): HTMLElement {
        return <HTMLElement>this.element;
    }
}