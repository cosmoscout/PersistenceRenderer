import * as vtk from 'vtk.js';
import { ILoader, ILoaderData } from './loader-interface';
export default class VtkFileLoader implements ILoader {
    /**
     * Loader instance settings.
     * See: https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html
     */
    private readonly settings;
    private readonly reader;
    /**
     * @param settings {{}} vtkHttpDataSetReader settings
     */
    constructor(settings?: {
        enableArray: boolean;
        fetchGzip: boolean;
    });
    /**
     * HttpDataSetReader instance
     */
    getReader(): vtk.IO.Core.vtkHttpDataSetReader;
    /**
     * Loads the provided vtk file
     * @param fileName {string} Url
     * @returns {Promise<ILoaderData>}
     */
    load(fileName: string): Promise<ILoaderData>;
}
