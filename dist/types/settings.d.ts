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
 * @type {Settings}
 */
export interface Settings {
    padding: number;
    canvasWidth: number;
    canvasHeight: number;
    strokeStyle: string;
    chunks: number;
    waitTime: number;
    enableSelection: boolean;
    enableSlider: boolean;
}
export declare const DefaultSettings: Settings;
