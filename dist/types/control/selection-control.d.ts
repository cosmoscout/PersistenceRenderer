import AbstractControl from './abstract-control';
/**
 * Very much @TODO
 */
export default class SelectionControl extends AbstractControl {
    private element;
    private canvas;
    private selectionBounds;
    getElement(): HTMLElement;
    init(): void;
    /**
     * @inheritDoc
     */
    update(): void;
    /**
     * Resizable rect for point selection
     *
     * @returns {void}
     * @private
     */
    private createElement;
    private addListener;
    private getSelectionBounds;
}
