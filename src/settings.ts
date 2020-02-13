/**
 * padding: Inner canvas padding
 *
 * canvasWidth: Width of Canvas in px
 * canvasHeight: Height of Canvas in px
 * strokeColor: Canvas stroke color
 *
 * chunks: Chunk bucket size for vtk points
 * waitTime: Time in ms between chunk draws
 *
 * @type {ISettings}
 */
import { pointDrawFunction } from './control/renderer-interface';

export type TickFormatter = {
  (tickValue: number): string;
};

export interface ISettings {
  readonly padding: number | Padding;

  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly strokeStyle: string;

  readonly chunks: number;
  readonly waitTime: number;
  readonly pointDrawFunction?: pointDrawFunction | undefined;

  readonly enableSelectionFilter: boolean;
  readonly enablePersistenceFilter: boolean;
  readonly enableAxes: boolean;

  readonly axesColor: string;
  readonly axesTickCount: number | number[];
  readonly axesTickLength: number | number[];
  readonly axesTickColor: string;
  readonly axesTickFractions: number;
  readonly axesTickFormatter?: TickFormatter;
  readonly axesTextColor: string;

  readonly selectionStopPropagation: boolean;
  readonly selectionMinWidth: number;

  /**
   * Accessor for settings padding
   * If pos is undefined padding.left or padding will be returned
   *
   * @param type {string|undefined} left / top / right / bottom
   * @throws {Error} If key does not exist on padding
   */
  getPadding(type?: string): number;
}

export type Padding = {
  [key: string]: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export const DefaultSettings: ISettings = {
  padding: {
    left: 40,
    top: 10,
    right: 10,
    bottom: 20,
  },

  canvasWidth: 500,
  canvasHeight: 500,
  strokeStyle: '#000',

  chunks: 100,
  waitTime: 5,
  pointDrawFunction: undefined,

  enableSelectionFilter: false,
  enablePersistenceFilter: false,
  enableAxes: true,

  axesColor: '#000',
  axesTickCount: 5,
  axesTickLength: 5,
  axesTickColor: '#000',
  axesTickFractions: 2,
  axesTextColor: '#000',

  selectionStopPropagation: false,
  selectionMinWidth: 10,

  getPadding(pos: string = 'left'): number {
    const { padding } = this;

    if (typeof padding === 'number') {
      return padding;
    }

    if (typeof padding[pos] === 'undefined') {
      throw new Error(`${pos} does not exist on [left, top, right, bottom].`);
    }

    return padding[pos];
  },
};
