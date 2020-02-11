// @ts-ignore
import * as vtk from 'vtk.js';
import PersistencePointTuple from '../point-tuple';
import { ILoader, ILoaderData } from './loader-interface';

export default class VtkFileLoader implements ILoader {
  /**
   * Loader instance settings.
   * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
   */
  private readonly settings: {};

  private readonly reader: vtk.IO.Core.vtkHttpDataSetReader;

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

          if (rawData.length % 3 !== 0) {
            throw new Error('Number of points not dividable by 3.');
          }

          const points = [];
          for (let i = 0; i < rawData.length; i += 6) {
            points.push(new PersistencePointTuple(
              rawData[i],
              rawData[i + 1],
              rawData[i + 2],

              rawData[i + 3],
              rawData[i + 4],
              rawData[i + 5],
            ));
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
        }).catch(() => {
          reject();
        });
      }).catch(() => {
        reject();
      });
    });
  }
}
