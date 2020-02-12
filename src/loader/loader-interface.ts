import PersistencePointTuple from '../persistence-point-tuple';
import Bounds from '../bounds';

/**
 * The data returned by the loader
 */
export interface ILoaderData {
  readonly points: PersistencePointTuple[];
  readonly bounds: number[];
  readonly persistenceBounds: Bounds;
}

export interface ILoader {
  load(T: any): Promise<ILoaderData>;
}
