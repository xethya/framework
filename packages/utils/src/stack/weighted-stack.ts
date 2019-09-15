import { KeysMatching } from "../types";
import { Stack } from "./stack";

/**
 * Selects all keys on T that are of type Number.
 */
export type WeightKey<T> = KeysMatching<T, number>;

export class WeightedStack<T> extends Stack<T> {
  /**
   * Indicates how many elements are in the stack.
   */
  protected count: number = 0;

  /**
   * Indicates the total amount of elements allowed in the stack.
   */
  protected readonly capacity: number;

  /**
   * Stores where to get the weight from the element. If left undefined,
   * the stack assumes every element has a weight of 1.
   */
  protected readonly weightKey?: WeightKey<T>;

  /**
   * A structure that works like a stack but stops receiving elements if a given threshold is reached.
   *
   * @param capacity Indicates the total amount of elements allowed in the stack.
   * @param weightKey Points to a property in T that contains the weight of the item. If left undefined,
   *                  the stack will assume all elements have a weight of 1.
   */
  constructor(capacity: number, weightKey?: WeightKey<T>) {
    super();

    this.capacity = capacity;
    this.weightKey = weightKey;
  }

  /**
   * Returns true when the stack can no longer add more items.
   */
  public isFull(): boolean {
    return this.count === this.capacity;
  }

  /**
   * Returns true if the stack has enough room for one more item.
   */
  public canPush(weight: number = 1): boolean {
    return this.count + weight <= this.capacity;
  }

  /**
   * Pushes an element on top of the stack. If there's no room,
   * it returns false. Otherwise, it returns true.
   *
   * @param value The element to add to the stack.
   */
  public push(value: T): boolean {
    const weight = this.getWeightOf(value);

    if (!this.canPush(weight)) {
      return false;
    }

    super.push(value);

    this.count += weight;

    return true;
  }

  /**
   * Pops an element from the top of the stack. If there's no room,
   * it returns false. Otherwise, it returns true.
   */
  public pop(): T | void {
    const value = super.pop();

    if (value) {
      this.count -= this.getWeightOf(value);
    }

    return value;
  }

  /**
   * Returns the weight of a given element, or 1 if `weightKey` was left unset.
   *
   * @param value The value being weighted.
   */
  protected getWeightOf(value: T): number {
    if (!this.weightKey) {
      return 1;
    }

    if (value instanceof String || value instanceof Number || value instanceof Boolean || value instanceof Date) {
      return 1;
    }

    return Number(value[this.weightKey]);
  }
}
