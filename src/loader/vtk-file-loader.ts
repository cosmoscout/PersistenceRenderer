// @ts-ignore
import * as vtk from 'vtk.js';
import PersistencePointTuple, {Coordinate, CriticalType, Point3D} from '../point-tuple';
import {ILoader, ILoaderData} from './loader-interface';

export default class VtkFileLoader implements ILoader {
  /**
   * Loader instance settings.
   * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
   */
  private readonly settings: {};

  private readonly reader: vtk.IO.Core.vtkHttpDataSetReader;

  private rawPointData: Float32Array | undefined;
  private criticalTypeData: Float32Array | undefined;
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
          this.criticalTypeData = pointData.getArray(1).getData();
          this.coordinateData =  pointData.getArray(2).getData();

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
          reject(`Loader Error: ${r}.`);
        });
      }).catch(() => {
        reject(`Could not access data at ${fileName}.`);
      });
    });
  }

  private createPointTuple(index: number, criticalIndex: number): PersistencePointTuple {
    if (typeof this.rawPointData === 'undefined' ||
        typeof this.coordinateData === 'undefined' ||
        typeof this.criticalTypeData === 'undefined') {
      throw new Error('Can\'t create PersistencePointTuple from undefined data.');
    }

    const lower: Point3D = {
      x: this.rawPointData[index],
      y: this.rawPointData[index + 1],
      z: this.rawPointData[index + 2],
    };

    const upper: Point3D = {
      x: this.rawPointData[index + 3],
      y: this.rawPointData[index + 4],
      z: this.rawPointData[index + 5],
    };

    const criticalType: CriticalType = {
      lower: this.criticalTypeData[criticalIndex],
      upper: this.criticalTypeData[criticalIndex + 1]
    };

    const coordinates: Coordinate = {
      lower: {
        x: this.coordinateData[index],
        y: this.coordinateData[index + 1],
        z: this.coordinateData[index + 2],
      },
      upper: {
        x: this.coordinateData[index + 3],
        y: this.coordinateData[index + 4],
        z: this.coordinateData[index + 5],
      }
    };

    return new PersistencePointTuple(
        lower,
        upper,
        criticalType,
        coordinates
    );
  }
}
