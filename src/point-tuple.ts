export interface Point3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Coordinate {
  readonly lower: Point3D;
  readonly upper: Point3D;
}

export interface CriticalType {
  readonly lower: number;
  readonly upper: number;
}

export default class PersistencePointTuple {
  /**
   * @type {number}
   */
  readonly persistence: number;

  readonly criticalType: CriticalType;

  readonly coordinates: Coordinate;

  /**
   * Lower Point on canvas
   */
  readonly lower: Point3D;

  /**
   * Upper Point on canvas
   */
  readonly upper: Point3D;

  /**
   * @param lower
   * @param upper
   * @param criticalType
   * @param coordinates
   */
  constructor(lower: Point3D, upper: Point3D, criticalType: CriticalType, coordinates: Coordinate) {
    this.lower = lower;
    this.upper = upper;
    this.criticalType = criticalType;

    this.coordinates = coordinates;

    this.persistence = upper.y - lower.y;
  }
}
