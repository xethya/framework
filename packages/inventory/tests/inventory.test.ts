import { Item } from "@xethya/item";
import { Inventory, INVENTORY_DEFAULT_CAPACITY } from "../src/inventory";

describe("Inventory", () => {
  describe("Basic instantiation", () => {
    it("can be instantiated with default settings", () => {
      const inventory = new Inventory();
      expect(inventory.capacity).toEqual(INVENTORY_DEFAULT_CAPACITY);
      expect(inventory.getAvailableSpace()).toEqual(INVENTORY_DEFAULT_CAPACITY);
    });

    it("can be instantiated with a custom capacity", () => {
      const inventory = new Inventory({
        capacityProvider: () => 50,
      });
      expect(inventory.capacity).toEqual(50);
      expect(inventory.getAvailableSpace()).toEqual(50);
    });

    it("can use a dynamic custom capacity", () => {
      let dynamicFactor = 2;
      const capacityProvider = () => dynamicFactor * 10;
      const inventory = new Inventory({ capacityProvider });
      expect(inventory.capacity).toEqual(20);
      dynamicFactor = 5;
      expect(inventory.capacity).toEqual(50);
    });
  });

  describe("Storage and Peeking", () => {
    let inventory: Inventory;

    beforeEach(() => {
      inventory = new Inventory();
    });

    it("can put an item and peek it by its ID", () => {
      const item = new Item();
      inventory.put(item);
      expect(inventory.getAvailableSpace()).toEqual(99);

      const storedItem = inventory.peek(item.id) as Item;
      expect(storedItem).toEqual(item);
    });

    it("can put multiple items and peek at them by their ID", () => {
      const itemA = new Item({ weight: 5 });
      const itemB = new Item({ weight: 12 });
      inventory.put(itemA, itemB);

      const storedItemA = inventory.peek(itemA.id) as Item;
      const storedItemB = inventory.peek(itemB.id) as Item;

      expect(inventory.getAvailableSpace()).toEqual(83);

      expect(storedItemA).toEqual(itemA);
      expect(storedItemB).toEqual(itemB);
    });

    it("can put an item and peek it by its position", () => {
      const item = new Item({ weight: 5 });
      inventory.put(item);

      const storedItem = inventory.peekAt(0);
      expect(storedItem).toEqual(item);
    });

    it("can put multiple items and peek at them by their position", () => {
      const itemA = new Item({ weight: 5 });
      const itemB = new Item({ weight: 12 });
      inventory.put(itemA, itemB);

      const storedItemA = inventory.peekAt(0) as Item;
      const storedItemB = inventory.peekAt(1) as Item;

      expect(storedItemA).toEqual(itemA);
      expect(storedItemB).toEqual(itemB);
    });

    it("can put multiple items and peek them all at once", () => {
      const itemA = new Item({ weight: 5 });
      const itemB = new Item({ weight: 12 });
      inventory.put(itemA, itemB);

      const [storedItemA, storedItemB] = inventory.peekAll();

      expect(storedItemA).toEqual(itemA);
      expect(storedItemB).toEqual(itemB);
    });

    it("can put an item, fill the inventory, resize its capacity and add a new item", () => {
      let dynamicFactor = 2;
      const dynamicInventory = new Inventory({ capacityProvider: () => dynamicFactor * 2 });
      dynamicInventory.put(new Item({ weight: 4 }));
      expect(dynamicInventory.isFull()).toEqual(true);
      dynamicFactor = 3;
      expect(dynamicInventory.isFull()).toEqual(false);
      dynamicInventory.put(new Item({ weight: 2 }));
      expect(dynamicInventory.isFull()).toEqual(true);
    });

    it("returns undefined when peeking non-existing items", () => {
      expect(inventory.peek("foo")).toEqual(undefined);
    });

    it("returns undefined when peeking non-existing positions", () => {
      expect(inventory.peekAt(1000)).toEqual(undefined);
    });

    it("returns an empty array when peeking an empty inventory", () => {
      expect(inventory.peekAll()).toEqual([]);
    });

    it("throws an error when peeking by a less-than-zero index on a non-empty inventory", () => {
      inventory.put(new Item());
      expect(() => inventory.peekAt(-1)).toThrow(/non-negative index/);
    });

    it("returns true when calling isEmpty() if the inventory has no items", () => {
      expect(inventory.isEmpty()).toEqual(true);
    });

    it("returns false when calling isEmpty() if the inventory has items", () => {
      inventory.put(new Item());
      expect(inventory.isEmpty()).toEqual(false);
    });

    it("returns true when calling isFull() if the inventory has reached its capacity", () => {
      inventory.put(new Item({ weight: inventory.capacity }));
      expect(inventory.getAvailableSpace()).toEqual(0);
      expect(inventory.isFull()).toEqual(true);
    });

    it("returns false when calling isFull() if the inventory has not reached its capacity", () => {
      inventory.put(new Item({ weight: inventory.capacity / 2 }));
      expect(inventory.getAvailableSpace()).toBeGreaterThan(0);
      expect(inventory.isFull()).toEqual(false);
    });
  });

  describe("Retrieval", () => {
    let inventory: Inventory;
    const itemA = new Item({ weight: 5 });
    const itemB = new Item({ weight: 12 });
    const itemC = new Item({ weight: 3 });

    beforeEach(() => {
      inventory = new Inventory();
      inventory.put(itemA, itemB, itemC);
    });

    it("can retrieve an item by its ID", () => {
      const availableSpaceBeforeRetrieval = inventory.getAvailableSpace();
      const retrievedItemA = inventory.retrieve(itemA.id) as Item;
      const availableSpaceAfterRetrieval = inventory.getAvailableSpace();
      expect(retrievedItemA).toEqual(itemA);
      expect(availableSpaceAfterRetrieval - availableSpaceBeforeRetrieval).toEqual(retrievedItemA.weight);
    });

    it("can retrieve an item by its position", () => {
      const availableSpaceBeforeRetrieval = inventory.getAvailableSpace();
      const retrievedItemB = inventory.retrieveAt(1) as Item;
      const availableSpaceAfterRetrieval = inventory.getAvailableSpace();
      expect(retrievedItemB).toEqual(itemB);
      expect(inventory.peekAt(0)).toEqual(itemA);
      expect(inventory.peekAt(1)).toEqual(itemC);
      expect(availableSpaceAfterRetrieval - availableSpaceBeforeRetrieval).toEqual(retrievedItemB.weight);
    });

    it("returns undefined when retrieving non-existing items, whether the inventory has items or not", () => {
      expect(inventory.retrieve("foo")).toEqual(undefined);
      expect(new Inventory().retrieve("foo")).toEqual(undefined);
    });

    it("returns undefined when peeking non-existing positions, whether the inventory has items or not", () => {
      expect(inventory.retrieveAt(1000)).toEqual(undefined);
      expect(new Inventory().retrieveAt(1000)).toEqual(undefined);
    });

    it("throws an error when retrieving by a less-than-zero index on a non-empty inventory", () => {
      expect(() => inventory.retrieveAt(-1)).toThrow(/non-negative index/);
    });
  });
});
