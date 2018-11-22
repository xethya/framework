export interface IShuffledElement<T> {
  element: T;
  shuffleIndex: number;
}

export type GroupMatchingFunction<T> = (value: T) => string;

export interface IGrouping<T> {
  [index: string]: T[];
}

export type TransformFunction<T, R> = (item: T) => R;
