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
export declare type TickFormatter = {
    (tickValue: number, prevTickValue: number): string;
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
export declare type Padding = {
    [key: string]: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
};
export declare const DefaultSettings: ISettings;
