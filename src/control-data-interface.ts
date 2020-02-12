import EventDispatcher from './event-dispatcher';
import { ISettings } from './settings';
import { IRenderer } from './control/renderer-interface';

export interface IControlData {
  readonly id: string;
  readonly events: EventDispatcher;
  readonly settings: ISettings;
  readonly renderer: IRenderer;
}
