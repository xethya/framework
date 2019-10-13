import { Item } from "@xethya/item";
import { assert, DynamicWeightedStack, Stack } from "@xethya/utils";

/**
 * By default, any inventory supports a maximum capacity
 * of 100 weight units.
 */
export const INVENTORY_DEFAULT_CAPACITY = 100;

/**
 * A default capacity provider to use the default capacity
 * for inventories.
 */
export const INVENTORY_DEFAULT_CAPACITY_PROVIDER = () => INVENTORY_DEFAULT_CAPACITY;

/**
 * A function used to calculate this inventory's capacity.
 * Its scope is the inventory's instance.
 *
 * @this {Inventory}
 */
export type InventoryCapacityProvider = (this: Inventory) => number;

/**
 * Customizes the inventory's features.
 */
export type InventoryOptions = {
  /**
   * A function used to calculate this inventory's capacity.
   * Its scope is the inventory's instance. Defaults to a basic
   * provider that always return 100.
   *
   * @default INVENTORY_DEFAULT_CAPACITY_PROVIDER
   */
  capacityProvider?: InventoryCapacityProvider;
};

/**
 * A lookup result for an entry in the inventory's index.
 */
export type InventoryIndexEntry = {
  /**
   * Used to preserve the inventory's order.
   */
  position: number;

  /**
   * A reference to the item itself.
   */
  item: Item;
};

/**
 * Allows to lookup an item by its ID.
 */
export type InventoryIndex = { [key: string]: InventoryIndexEntry };

export class Inventory {
  /**
   * Contains a list of all the items stored in this inventory.
   */
  protected readonly contents: DynamicWeightedStack<Item>;

  /**
   * Allows to quickly lookup an item by its unique identifier.
   */
  protected readonly index: InventoryIndex;

  /**
   * A function used to calculate this inventory's capacity.
   * Its scope is the inventory's instance.
   *
   * @this {Inventory}
   */
  protected readonly capacityProvider: InventoryCapacityProvider;

  protected lastCalculatedCapacity: number;

  /**
   * Counts how many items have been stored in the inventory.
   *
   * @todo Move this to the DynamicWeightedStack (or maybe any Stack?).
   */
  protected count: number = 0;

  /**
   * Indicates how full this inventory is.
   *
   * @todo Move this to the DynamicWeightedStack (or maybe any Stack?).
   */
  protected occupiedCapacity: number = 0;

  /**
   * Allows to keep track of items placed in a container, up to
   * a certain capacity.
   *
   * @param options {InventoryOptions}
   */
  constructor(options: InventoryOptions = {}) {
    this.capacityProvider = options.capacityProvider || INVENTORY_DEFAULT_CAPACITY_PROVIDER;
    this.contents = new DynamicWeightedStack<Item>(this.capacity, "weight");
    this.index = {};
  }

  /**
   * Indicates the current capacity of the inventory. If the capacity has
   * changed since the last time it was calculate, it'll autoresize the
   * inventory's stack.
   */
  public get capacity(): number {
    const capacity = this.capacityProvider.bind(this)();

    if (this.lastCalculatedCapacity && this.lastCalculatedCapacity !== capacity) {
      this.contents.resize(this.lastCalculatedCapacity);
    }

    this.lastCalculatedCapacity = capacity;

    return this.lastCalculatedCapacity;
  }

  /**
   * Returns the index entries as an array of values.
   */
  protected get indexEntries(): InventoryIndexEntry[] {
    return Object.values(this.index);
  }

  /**
   * Returns the available capacity on this inventory.
   */
  getAvailableSpace(): number {
    return this.capacity - this.occupiedCapacity;
  }

  /**
   * Puts an item or items inside this inventory. This will affect
   * the inventory's occupied capacity.
   *
   * @param items {...Item}
   */
  put(...items: Item[]): void {
    items.forEach(item => {
      this.contents.push(item);
      this.index[item.id] = { position: this.count, item };

      // TODO: These could be exposed from the stack, removing the need for extra state.
      this.count += 1;
      this.occupiedCapacity += item.weight;
    });
  }

  /**
   * Returns information about an item in the inventory,
   * looking it up by its unique identifier. This will not
   * have any impact on the inventory's occupied capacity.
   *
   * @param id {string}
   */
  peek(id: string): Item | void {
    return this.index[id] ? this.index[id].item : undefined;
  }

  /**
   * Returns information about an item in the inventory,
   * looking it up by its numeric position. This will not
   * have any impact on the inventory's occupied capacity.
   *
   * @param position {number}
   */
  peekAt(position: number): Item | void {
    if (this.isEmpty()) {
      return;
    }

    const indexEntry = this.getByPosition(position);

    if (!indexEntry) {
      return;
    }

    return indexEntry.item;
  }

  /**
   * Returns information about *all* of this inventory's
   * items as an array.
   */
  peekAll(): Item[] {
    if (this.isEmpty()) {
      return [];
    }

    const items: Item[] = [];
    this.indexEntries.forEach(({ position, item }) => (items[position] = item));
    return items;
  }

  /**
   * Extracts an item from the inventory by its unique identifier.
   * This *will* affect the inventory's occupied capacity.
   *
   * @param id {string}
   */
  retrieve(id: string): Item | void {
    if (this.isEmpty()) {
      return;
    }

    const item = this.peek(id);

    if (!item) {
      return;
    }

    this.extractFromContents(item);

    return item;
  }

  /**
   * Extracts an item from the inventory by its position.
   * This *will* affect the inventory's occupied capacity.
   *
   * @param id {string}
   */
  retrieveAt(position: number): Item | void {
    if (this.isEmpty()) {
      return;
    }

    const item = this.peekAt(position);

    if (!item) {
      return;
    }

    this.extractFromContents(item);

    return item;
  }

  /**
   * Returns `true` if the inventory is full, `false` if it's not.
   */
  isFull(): boolean {
    return this.getAvailableSpace() === 0;
  }

  /**
   * Returns `true` if the inventory is empty, `false` if it's not.
   */
  isEmpty(): boolean {
    return this.getAvailableSpace() === this.capacity;
  }

  /**
   * Removes an item from the inventory and adjusts the capacity
   * accordingly.
   *
   * @param itemToRetrieve {Item}
   */
  protected extractFromContents(itemToRetrieve: Item) {
    const temporaryStack = new Stack<Item>();

    while (temporaryStack.peek() !== itemToRetrieve && !this.contents.isEmpty()) {
      temporaryStack.push(this.contents.pop() as Item);
    }

    temporaryStack.pop();
    delete this.index[itemToRetrieve.id];

    while (!temporaryStack.isEmpty()) {
      const item = temporaryStack.pop() as Item;
      this.contents.push(item);
      this.index[item.id].position -= 1;
    }

    this.count -= 1;
    this.occupiedCapacity -= itemToRetrieve.weight;
  }

  /**
   * Returns an item by its position in the inventory index.
   *
   * @param position {number}
   */
  protected getByPosition(position: number) {
    assert(position >= 0, "A non-negative index must be used to access the inventory by position");
    return this.indexEntries.find(entry => entry.position === position);
  }
}
