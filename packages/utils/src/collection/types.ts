export type QueryFunction<T> = (value: T) => boolean;

export type CollectionEventCallback<T> = (collection: ICollection<T>) => void;
export type CollectionDataEventCallback<T> = (collection: ICollection<T>, ...items: T[]) => void;

export interface ICollection<T> {
  indexName: string;
  readonly count: number;

  get(id: string): T | undefined;
  getAll(): T[];
  getAllKeys(): string[];
  where(condition: QueryFunction<T>): T[];
  contains(id: string): boolean;
  add(...items: T[]): void;
  remove(id: string): void;
  removeAll(): void;

  onBeforeAdd(callback: CollectionDataEventCallback<T>): void;
  onAdd(callback: CollectionEventCallback<T>): void;
  onBeforeRemove(callback: CollectionEventCallback<T>): void;
  onRemove(callback: CollectionEventCallback<T>): void;
  onBeforeRemoveAll(callback: CollectionEventCallback<T>): void;
  onRemoveAll(callback: CollectionEventCallback<T>): void;
}

export interface IIndexedByString<T> {
  [index: string]: T;
}
