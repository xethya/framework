import { v4 as generateUUID } from "uuid";

export const ITEM_DEFAULT_WEIGHT = 1;

/**
 * Customizes the item's features.
 */
export type ItemOptions = {
  /**
   * How much this item weights. Defaults to ITEM_DEFAULT_WEIGHT (1).
   *
   * @default 1
   */
  weight?: number;
};

export class Item {
  /**
   * A unique identifier for the item.
   */
  public readonly id: string;

  /**
   * How much this item weights. Defaults to ITEM_DEFAULT_WEIGHT (1).
   *
   * @default 1
   */
  public readonly weight: number;

  /**
   * Represents something an entity can hold and/or use.
   *
   * @param options {ItemOptions}
   */
  constructor(options: ItemOptions = {}) {
    this.id = generateUUID();
    this.weight = options.weight || ITEM_DEFAULT_WEIGHT;
  }
}
