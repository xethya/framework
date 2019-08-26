import { Stack } from "../../src/stack";

describe("Stack", () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  it("can be instantiated", () => {
    expect(stack.isEmpty()).toEqual(true);
  });

  it("can peek on an empty stack", () => {
    expect(stack.peek()).toEqual(undefined);
  });

  it("can receive a new element", () => {
    stack.push(1);
    expect(stack.peek()).toEqual(1);
    expect(stack.isEmpty()).toEqual(false);
  });

  it("can receive multiple elements", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.peek()).toEqual(3);
  });

  it("can get a single element", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toEqual(2);
  });

  it("can get multiple elements", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toEqual(2);
    expect(stack.pop()).toEqual(1);
  });
});
