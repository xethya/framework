import EventEmitter from "eventemitter3";
import assert from "../assert";
import {
  CollectionDataEventCallback,
  CollectionEventCallback,
  ICollection,
  IIndexedByString,
  QueryFunction,
} from "./types";

export default class Collection<T extends { [index: string]: any }> implements ICollection<T> {
  public indexName: string;
  protected events: EventEmitter<string | symbol>;
  protected list: IIndexedByString<T> = {};

  constructor(indexName: string) {
    this.events = new EventEmitter();
    this.indexName = indexName;
  }

  get count(): number {
    return this.getAllKeys().length;
  }

  get(id: string): T | undefined {
    return this.list[id];
  }

  getAll(): T[] {
    return this.getAllKeys().map((id: string) => this.list[id]);
  }

  getAllKeys(): string[] {
    return Object.keys(this.list);
  }

  where(condition: QueryFunction<T>): T[] {
    return this.getAll().filter(condition);
  }

  contains(id: string): boolean {
    return id in this.list;
  }

  add(...items: T[]): void {
    this.events.emit("before:add", this, ...items);

    items.forEach((item: T) => {
      const index = item[this.indexName];
      assert(!this.contains(index), `An item already exists with key: ${index}`);

      this.list[index] = item;
    });

    this.events.emit("add", this);
  }

  remove(id: string): void {
    if (this.contains(id)) {
      this.events.emit("before:remove", this, this.list[id]);

      const deletedItem = this.list[id];
      delete this.list[id];

      this.events.emit("remove", this, deletedItem);
    }
  }

  removeAll(): void {
    this.events.emit("before:removeAll", this);

    this.list = {};

    this.events.emit("removeAll", this);
  }

  static fromArrayOf<T>(items: T[], indexName: string) {
    const collection: Collection<T> = new Collection<T>(indexName);

    collection.add(...items);

    return collection;
  }

  onBeforeAdd(callback: CollectionDataEventCallback<T>) {
    this.events.on("before:add", callback);
  }

  onAdd(callback: CollectionDataEventCallback<T>) {
    this.events.on("add", callback);
  }

  onBeforeRemove(callback: CollectionDataEventCallback<T>) {
    this.events.on("before:remove", callback);
  }

  onRemove(callback: CollectionDataEventCallback<T>) {
    this.events.on("remove", callback);
  }

  onBeforeRemoveAll(callback: CollectionEventCallback<T>) {
    this.events.on("before:removeAll", callback);
  }

  onRemoveAll(callback: CollectionEventCallback<T>) {
    this.events.on("removeAll", callback);
  }
}
