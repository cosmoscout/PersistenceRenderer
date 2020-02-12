import PersistencePointTuple from './persistence-point-tuple';
import Bounds from './bounds';
export interface IPointData {
    /**
     * Processed vtk points
     * @type {PersistencePointTuple[]}
     */
    readonly points: PersistencePointTuple[];
    /**
     * Chunked points
     * @see {chunkPoints}
     * @type {PersistencePointTuple[][]}
     */
    readonly pointChunks: PersistencePointTuple[][];
    /**
     * VTK point bounds
     * Index: 0 - xMin | 1 - xMax | 2 - yMin | 3 - yMax | 4 - zMin | 5 zMax
     * @type {number[]}
     */
    readonly bounds: number[];
    /**
     * Lower and Upper Persistence Bounds
     */
    readonly persistenceBounds: Bounds;
    /**
     * Active persistence bound filter from slider
     */
    readonly activePersistenceBounds: Bounds;
    setActivePersistenceBounds(bounds: Bounds): void;
    /**
     * Active selection rect bounds
     */
    readonly activeSelectionBounds: Bounds;
    setActiveSelectionBounds(bounds: Bounds | undefined): void;
    /**
     * Points filtered by lower/upper persistence and selection
     */
    filteredPoints(): PersistencePointTuple[];
    filteredPointsChunked(): PersistencePointTuple[][];
    /**
     * Bounds x-min
     */
    xMin(): number;
    /**
     * Bounds x-max
     */
    xMax(): number;
    /**
     * Bounds y-min
     */
    yMin(): number;
    /**
     * Bounds y-max
     */
    yMax(): number;
}
