import { Stack } from "./stack";

export class LimitedCapacityStack<T> extends Stack<T> {
  /**
   * Indicates how many elements are in the stack.
   */
  protected count: number = 0;

  /**
   * Indicates the total amount of elements allowed in the stack.
   */
  protected readonly capacity: number;

  /**
   * A structure that works like a stack but stops receiving elements if a given threshold is reached.
   *
   * @param capacity Indicates the total amount of elements allowed in the stack.
   */
  constructor(capacity: number) {
    super();
    this.capacity = capacity;
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
  public canPush(): boolean {
    return this.count < this.capacity;
  }

  /**
   * Pushes an element on top of the stack. If there's no room,
   * it returns false. Otherwise, it returns true.
   *
   * @param value The element to add to the stack.
   */
  public push(value: T): boolean {
    if (!this.canPush()) {
      return false;
    }

    super.push(value);

    this.count += 1;

    return true;
  }

  /**
   * Pops an element from the top of the stack. If there's no room,
   * it returns false. Otherwise, it returns true.
   */
  public pop(): T | void {
    const value = super.pop();

    if (value) {
      this.count -= 1;
    }

    return value;
  }
}
