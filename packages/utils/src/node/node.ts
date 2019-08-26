export class Node<T> {
  /**
   * The value of the element.
   */
  public readonly value: T;

  /**
   * Represents an element in a structure.
   */
  constructor(value: T) {
    this.value = value;
  }
}
