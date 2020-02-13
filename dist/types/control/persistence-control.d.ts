import AbstractControl from './abstract-control';
import { IPointData } from '../point-data-interface';
/**
 * Persistence Bounds Control Slider
 */
export default class PersistenceControl extends AbstractControl {
    /**
     * @type {HTMLElement|undefined}
     * @private
     */
    private element;
    /**
     * @type {Bounds|undefined}
     * @private
     */
    private selectedPersistenceBounds;
    /**
     * Current noUiSlider instance
     * @type {noUiSlider.noUiSlider|undefined}
     * @private
     */
    private noUiSlider;
    /**
     * @inheritDoc
     */
    getElement(): HTMLElement;
    /**
     * @inheritDoc
     */
    init(): void;
    /**
     * Creates a two-handled slider for given persistence bounds
     * Update exits early if current selected bounds and selected bounds in IPointData are equal
     * @returns {void}
     */
    update(data: IPointData): void;
    /**
     * Creates the actual noUiSlider container
     * @returns {void}
     * @private
     */
    private createElement;
    /**
     * Adds all needed event listeners to the slider instance
     * @returns {void}
     * @private
     */
    private addListener;
}
