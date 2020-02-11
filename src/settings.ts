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
  readonly padding: number;

  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly strokeStyle: string;

  readonly enableTicks: boolean;


  readonly chunks: number;
  readonly waitTime: number;

  readonly enableSelection: boolean;
  readonly enableSlider: boolean;
}

export const DefaultSettings: Settings = {
  padding: 10,

  canvasWidth: 500,
  canvasHeight: 500,
  strokeStyle: '#000',

  enableTicks: true,

  chunks: 100,
  waitTime: 150,

  enableSelection: true,
  enableSlider: true,
};
