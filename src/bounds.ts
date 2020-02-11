/**
 * Wrapper class for min/max bounds
 */
export default class Bounds {
    public readonly min: number;
    public readonly max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    equals(other: Bounds): boolean {
        return this.min === other.min && this.max === other.max;
    };
}