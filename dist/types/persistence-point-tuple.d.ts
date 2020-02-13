/**
 * Point coordinate in 3D-Space
 */
export interface IPoint3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}
/**
 * Coordinate containing a lower and upper point in 3D
 */
export interface ICoordinate {
    readonly lower: IPoint3D;
    readonly upper: IPoint3D;
}
export interface ICriticalType {
    readonly lower: number;
    readonly upper: number;
}
export default class PersistencePointTuple {
    /**
     * Point persistence computed as upper.y - lower.y
     * @type {number}
     */
    readonly persistence: number;
    readonly criticalType: ICriticalType;
    readonly coordinates: ICoordinate;
    /**
     * Lower Point on canvas
     */
    readonly lower: IPoint3D;
    /**
     * Upper Point on canvas
     */
    readonly upper: IPoint3D;
    /**
     * @param lower
     * @param upper
     * @param criticalType
     * @param coordinates
     */
    constructor(lower: IPoint3D, upper: IPoint3D, criticalType: ICriticalType, coordinates: ICoordinate);
}
