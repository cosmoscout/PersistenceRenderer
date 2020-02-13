import AbstractControlModule from './abstract-control-module';
export default class Selection extends AbstractControlModule {
    private element;
    private canvas;
    private selectionBounds;
    private selectionStart;
    getElement(): HTMLElement;
    /**
     * @inheritDoc
     */
    update(): void;
    /**
     * Resizable rect for point selection
     *
     * @return {void}
     * @private
     */
    protected createElement(): void;
    private addListener;
    private initSelection;
    private updateSelection;
    private hideSelection;
    private getSelectionBounds;
}
