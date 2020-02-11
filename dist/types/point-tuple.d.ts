export default class PersistencePointTuple {
    /**
     * @type {number}
     */
    readonly persistence: number;
    /**
     * @type {number}
     */
    readonly x1: number;
    /**
     * @type {number}
     */
    readonly y1: number;
    /**
     * @type {number}
     */
    readonly z1: number;
    /**
     * @type {number}
     */
    readonly x2: number;
    /**
     * @type {number}
     */
    readonly y2: number;
    /**
     * @type {number}
     */
    readonly z2: number;
    /**
     * @param x1 {number} x-Position of Point 1
     * @param y1 {number} y-Position of Point 1
     * @param z1 {number} z-Position of Point 1
     * @param x2 {number} x-Position of Point 2
     * @param y2 {number} y-Position of Point 2
     * @param z2 {number} z-Position of Point 2
     */
    constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
}
