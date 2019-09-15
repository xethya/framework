import assert from "../assert";
import { WeightedStack } from "./weighted-stack";

/**
 * A structure that works like a stack but stops receiving elements if a given threshold is reached.
 * Unlike WeightedStack<T>, this variant allows to resize the capacity on demand.
 *
 * @param capacity Indicates the total amount of elements allowed in the stack.
 * @param weightKey Points to a property in T that contains the weight of the item. If left undefined,
 *                  the stack will assume all elements have a weight of 1.
 */
export class DynamicWeightedStack<T> extends WeightedStack<T> {
  protected capacity: number;

  /**
   * Changes the capacity limit of the stack.
   *
   * @param newCapacity The new limit for the count of elements in this stack.
   */
  public resize(newCapacity: number) {
    assert(
      this.count <= newCapacity,
      "The stack cannot be shrunk if the current count exceeds the new capacity. Remove some elements of the stack first, then retry shrinking.",
    );

    this.capacity = newCapacity;
  }
}
