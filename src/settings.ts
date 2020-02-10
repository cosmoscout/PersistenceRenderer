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

export const DefaultSettings: Settings = {
    padding: 10,

    canvasWidth: 500,
    canvasHeight: 500,
    strokeStyle: '#000',

    chunks: 100,
    waitTime: 150,

    enableSelection: true,
    enableSlider: true,
};