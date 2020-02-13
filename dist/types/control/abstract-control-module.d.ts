import EventDispatcher from '../event-dispatcher';
import { IPointData } from '../point-data-interface';
import { IControlData } from '../control-data-interface';
/**
 * Base class for arbitrary control elements
 */
export default abstract class AbstractControlModule {
    /**
     * Unique ID added to control elements
     */
    protected readonly id: string;
    /**
     * Event dispatcher
     * Events are dispatched on the container element
     */
    protected readonly events: EventDispatcher;
    /**
     * Common control methods and objects
     */
    protected readonly controlData: IControlData;
    /**
     * Current Point data on initialization.
     * New data gets passed to {update}
     */
    protected pointData: IPointData;
    /**
     * Simple data constructor
     * @param controlData {IControlData & IPointData} Instance of {PersistenceRenderer}
     */
    constructor(controlData: IControlData & IPointData);
    /**
     * Returns the actual control html element
     */
    abstract getElement(): HTMLElement;
    /**
     * Updated Points
     * @param data {IPointData}
     */
    abstract update(data: IPointData): any;
    protected abstract createElement(): void;
}
