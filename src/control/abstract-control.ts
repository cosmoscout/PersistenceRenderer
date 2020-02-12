import EventDispatcher from '../event-dispatcher';
import { IPointData } from '../point-data-interface';
import { IControlData } from '../control-data-interface';

/**
 * Base class for arbitrary control elements
 */
export default abstract class AbstractControl {
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
  constructor(controlData: IControlData & IPointData) {
    this.id = controlData.id;
    this.events = controlData.events;
    this.controlData = controlData;
    this.pointData = controlData;
  }

  /**
   * Returns the actual control html element
   */
  public abstract getElement(): HTMLElement;

  /**
   * Updated Points
   * @param data {IPointData}
   */
  public abstract update(data: IPointData): any;

  /**
   * Init function
   * Should be called after instantiating the control element
   * Typically creates the element
   */
  public abstract init(): void;
}
