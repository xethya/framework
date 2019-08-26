import { Node } from "./node";

export class StackNode<T> extends Node<T> {
  /**
   * Returns a reference to the next node in the stack.
   */
  public next?: Node<T>;

  /**
   * Represents a node in a stack. It exposes a `next` link
   * to traverse the stack.
   *
   * @param value The value of the element.
   */
  constructor(value: T) {
    super(value);
  }
}
