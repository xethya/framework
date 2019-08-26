import { StackNode } from "../node/stack-node";

/**
 * Represents a pile of elements from top to bottom.
 */
export class Stack<T> {
  protected top?: StackNode<T>;

  /**
   * Returns whether the stack is empty or not.
   */
  public isEmpty(): boolean {
    return !this.top;
  }

  /**
   * Returns the value of the top element of the stack.
   */
  public peek(): T | void {
    if (!this.top) {
      return;
    }

    return this.top.value;
  }

  /**
   * Adds a value to the top of the stack.
   *
   * @param value The value of the element.
   */
  public push(value: T): void {
    const node = new StackNode<T>(value);
    node.next = this.top;
    this.top = node;
  }

  /**
   * Removes the top element of the stack and returns it.
   */
  public pop(): T | void {
    if (!this.top) {
      return;
    }

    const { value } = this.top;
    this.top = this.top.next;

    return value;
  }
}
