import * as vtk from 'vtk.js';
import { ILoader, ILoaderData } from './loader-interface';
export default class VtkFileLoader implements ILoader {
    /**
     * Loader instance settings.
     * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
     */
    private readonly settings;
    /**
     * VTK Dataset reader
     * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
     */
    private readonly reader;
    /**
     * Point data from getPoints().getData()
     * Contains all points in a one-dimensional array
     * Sorted as [x1, y1, z1, x2, y2, z2, ..., xn, yn, zn]
     */
    private rawPointData;
    /**
     * Critical type data from getPointData().getArray(1).getData()
     * One-dimensional array containing all types for all point tuples
     * Sorted as [criticalTypeLower1, criticalTypeUpper1, criticalTypeLower2, ...]
     */
    private criticalTypeData;
    /**
     * Coordinate data for all points
     * Sorted like rawPointData
     * @see {rawPointData}
     */
    private coordinateData;
    /**
     * @param settings {{}} vtkHttpDataSetReader settings
     */
    constructor(settings?: {
        enableArray: boolean;
        fetchGzip: boolean;
    });
    /**
     * HttpDataSetReader instance
     * @returns {vtk.IO.Core.vtkHttpDataSetReader}
     */
    getReader(): vtk.IO.Core.vtkHttpDataSetReader;
    /**
     * Loads the provided vtk file
     * @param fileName {string} Url
     * @returns {Promise<ILoaderData>}
     */
    load(fileName: string): Promise<ILoaderData>;
    /**
     * Creates a point tuple instance from raw- / critical- / coordinate-data
     * @param index {number} Raw point data mod 6
     * @param criticalIndex {number}
     * @returns {PersistencePointTuple}
     */
    private createPointTuple;
}
