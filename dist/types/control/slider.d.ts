import AbstractControlModule from './abstract-control-module';
import { IPointData } from '../point-data-interface';
/**
 * Persistence Bounds Control Slider
 */
export default class PersistenceSlider extends AbstractControlModule {
    /**
     * @type {HTMLElement}
     * @private
     */
    private element;
    /**
     * @type {Bounds}
     * @private
     */
    private selectedPersistenceBounds;
    /**
     * Current noUiSlider instance
     * @type {noUiSlider.noUiSlider}
     * @private
     */
    private noUiSlider;
    /**
     * @inheritDoc
     */
    getElement(): HTMLElement;
    /**
     * Creates a two-handled slider for given persistence bounds
     * Update exits early if current selected bounds and selected bounds in IPointData equal
     */
    update(data: IPointData): void;
    /**
     * Creates the actual noUiSlider container
     */
    protected createElement(): void;
    /**
     * Adds all needed event listeners to the slider instance
     */
    private addListener;
}
