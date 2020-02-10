export default class PersistencePointTuple {
    /**
     * @type {number}
     */
    readonly persistence: number;

    /*
     * Lower Point Position
     */
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

    /*
     * Upper Point Position
     */
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
    constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;

        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;

        this.persistence = y2 - y1;
    }
}