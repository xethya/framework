import { WeightedStack } from "@xethya/utils";
import { Item } from "./item";

export type InventoryOptions = {
  slotCapacity: number;
};

export class Inventory {
  public readonly contents: WeightedStack<Item>;
  public readonly slotCapacity: number;

  constructor(options: InventoryOptions) {
    this.contents = new WeightedStack<Item>(100, "weight");
    this.slotCapacity = options.slotCapacity;
  }
}
