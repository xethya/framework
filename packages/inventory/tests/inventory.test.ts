import { Inventory, INVENTORY_DEFAULT_CAPACITY } from "../src/inventory";

describe("Inventory", () => {
  it("can be instantiated", () => {
    const inventory = new Inventory();
    expect(inventory.capacity).toEqual(INVENTORY_DEFAULT_CAPACITY);
    expect(inventory.getAvailableSpace()).toEqual(INVENTORY_DEFAULT_CAPACITY);
  });
});
