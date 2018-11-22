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

  onBeforeAdd(callback: CollectionDataEventCallback<T>);
  onAdd(callback: CollectionEventCallback<T>);
  onBeforeRemove(callback: CollectionEventCallback<T>);
  onRemove(callback: CollectionEventCallback<T>);
  onBeforeRemoveAll(callback: CollectionEventCallback<T>);
  onRemoveAll(callback: CollectionEventCallback<T>);
}

export interface IIndexedByString<T> {
  [index: string]: T;
}
