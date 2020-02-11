import EventDispatcher from './event-dispatcher';
import { Settings } from './settings';
import { IRenderer } from './control/renderer-interface';

export interface IControlData {
  readonly id: string;
  readonly events: EventDispatcher;
  readonly settings: Settings;
  readonly renderer: IRenderer;
}
