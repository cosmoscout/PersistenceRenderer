import EventDispatcher from "../event-dispatcher";
import {IControlData} from "../index";
import {IPointData} from "../point-data-interface";

export default abstract class AbstractControlModule {
    protected readonly events: EventDispatcher;
    protected readonly id: string;
    protected readonly controlData: IControlData;
    protected pointData: IPointData;

    protected constructor(controlData: IControlData & IPointData) {
        this.id = controlData.id;
        this.events = controlData.events;
        this.controlData = controlData;
        this.pointData = controlData;
    }

    public abstract getElement(): HTMLElement;

    public abstract update(data: IPointData): any;
}