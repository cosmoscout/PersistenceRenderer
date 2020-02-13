/**
 * Wrapper class for min/max bounds
 */
export default class Bounds {
    readonly min: number;
    readonly max: number;
    readonly width: number;
    constructor(min: number, max: number);
    equals(other: Bounds): boolean;
}
