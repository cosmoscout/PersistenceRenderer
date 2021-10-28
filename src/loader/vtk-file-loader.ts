// @ts-ignore
import * as vtk from 'vtk.js';
import PersistencePointTuple, { ICoordinate, ICriticalType, IPoint3D } from '../persistence-point-tuple';
import { ILoader, ILoaderData } from './loader-interface';

export default class VtkFileLoader implements ILoader {
  /**
   * Loader instance settings.
   * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
   */
  private readonly settings: {};

  /**
   * VTK Dataset reader
   * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
   */
  private readonly reader: vtk.IO.Core.vtkHttpDataSetReader;

  /**
   * Point data from getPoints().getData()
   * Contains all points in a one-dimensional array
   * Sorted as [x1, y1, z1, x2, y2, z2, ..., xn, yn, zn]
   */
  private rawPointData: Float32Array | undefined;

  /**
   * Critical type data from getPointData().getArray(1).getData()
   * One-dimensional array containing all types for all point tuples
   * Sorted as [criticalTypeLower1, criticalTypeUpper1, criticalTypeLower2, ...]
   */
  private criticalTypeData: Float32Array | undefined;

  /**
   * Coordinate data for all points
   * Sorted like rawPointData
   * @see {rawPointData}
   */
  private coordinateData: Float32Array | undefined;

  /**
   * @param settings {{}} vtkHttpDataSetReader settings
   */
  constructor(settings = { enableArray: true, fetchGzip: false }) {
    if (typeof (<any>window).vtk === 'undefined') {
      throw new Error('VTK.js is required.');
    }

    this.settings = settings;
    this.reader = (<any>window).vtk.IO.Core.vtkHttpDataSetReader.newInstance(this.settings);
  }

  /**
   * HttpDataSetReader instance
   * @returns {vtk.IO.Core.vtkHttpDataSetReader}
   */
  public getReader(): vtk.IO.Core.vtkHttpDataSetReader {
    return this.reader;
  }

  /**
   * Loads the provided vtk file
   * @param fileName {string} Url
   * @returns {Promise<ILoaderData>}
   */
  public load(fileName: string): Promise<ILoaderData> {
    return new Promise((resolve, reject) => {
      this.reader.setUrl(fileName).then((reader: vtk.Reader) => {
        reader.loadData().then(() => {
          const rawData = reader.getOutputData().getPoints().getData();
          const pointData = reader.getOutputData().getPointData();

          if (rawData.length % 3 !== 0) {
            throw new Error('Number of points not dividable by 3.');
          }

          this.rawPointData = rawData;
          this.criticalTypeData = pointData.getArray("CriticalType").getData();
          this.coordinateData = pointData.getArray("Coordinates").getData();

          const points = [];

          let criticalTypeIndex = 0;
          for (let i = 0; i < rawData.length; i += 6) {
            points.push(this.createPointTuple(i, criticalTypeIndex));
            criticalTypeIndex += 2;
          }

          console.info(`VKT data for file ${fileName} loaded.`);

          resolve(<ILoaderData>{
            points,
            bounds: reader.getOutputData().getBounds(),
            persistenceBounds: points.reduce((acc, val) => {
              acc.min = (acc.min === 0 || val.persistence < acc.min) ? val.persistence : acc.min;
              acc.max = (acc.max === 0 || val.persistence > acc.max) ? val.persistence : acc.max;
              return acc;
            }, { min: 0, max: 0 }),
          });
        }).catch((r:string) => {
          reject(new Error(`Loader Error: ${r}.`));
        });
      }).catch(() => {
        reject(new Error(`Could not access data at ${fileName}.`));
      });
    });
  }

  /**
   * Creates a point tuple instance from raw- / critical- / coordinate-data
   * @param index {number} Raw point data mod 6
   * @param criticalIndex {number}
   * @returns {PersistencePointTuple}
   */
  private createPointTuple(index: number, criticalIndex: number): PersistencePointTuple {
    if (typeof this.rawPointData === 'undefined'
        || typeof this.coordinateData === 'undefined'
        || typeof this.criticalTypeData === 'undefined') {
      throw new Error('Can\'t create PersistencePointTuple from undefined data.');
    }

    const lower: IPoint3D = {
      x: this.rawPointData[index],
      y: this.rawPointData[index + 1],
      z: this.rawPointData[index + 2],
    };

    const upper: IPoint3D = {
      x: this.rawPointData[index + 3],
      y: this.rawPointData[index + 4],
      z: this.rawPointData[index + 5],
    };

    const criticalType: ICriticalType = {
      lower: this.criticalTypeData[criticalIndex],
      upper: this.criticalTypeData[criticalIndex + 1],
    };

    const coordinates: ICoordinate = {
      lower: {
        x: this.coordinateData[index],
        y: this.coordinateData[index + 1],
        z: this.coordinateData[index + 2],
      },
      upper: {
        x: this.coordinateData[index + 3],
        y: this.coordinateData[index + 4],
        z: this.coordinateData[index + 5],
      },
    };

    return new PersistencePointTuple(
      lower,
      upper,
      criticalType,
      coordinates,
    );
  }
}
