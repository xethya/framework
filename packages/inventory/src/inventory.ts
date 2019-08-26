export type InventoryOptions = {
  slotCapacity: number;
};

export class Inventory {
  public readonly slotCapacity: number;

  constructor(options: InventoryOptions) {
    this.slotCapacity = options.slotCapacity;
  }
}
