import { LimitedCapacityStack } from "../../src/stack";

describe("LimitedCapacityStack", () => {
  let stack: LimitedCapacityStack<number>;

  beforeEach(() => {
    stack = new LimitedCapacityStack<number>(10);
  });

  it("can be instantiated", () => {
    expect(stack.isEmpty()).toEqual(true);
    expect(stack.isFull()).toEqual(false);
  });

  it("can receive a new element", () => {
    stack.push(1);
    expect(stack.peek()).toEqual(1);
    expect(stack.isEmpty()).toEqual(false);
    expect(stack.isFull()).toEqual(false);
  });

  it("can receive multiple elements", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    stack.push(5);
    stack.push(6);
    stack.push(7);
    stack.push(8);
    stack.push(9);
    expect(stack.push(10)).toEqual(true);
    expect(stack.isFull()).toEqual(true);
  });

  it("can't receive an element after being filled", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    stack.push(5);
    stack.push(6);
    stack.push(7);
    stack.push(8);
    stack.push(9);
    expect(stack.push(10)).toEqual(true);
    expect(stack.isFull()).toEqual(true);
    expect(stack.canPush()).toEqual(false);
    expect(stack.push(11)).toEqual(false);
  });

  it("can make room on a previously filled stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    stack.push(5);
    stack.push(6);
    stack.push(7);
    stack.push(8);
    stack.push(9);
    stack.push(10);
    expect(stack.isFull()).toEqual(true);
    expect(stack.pop()).toEqual(10);
    expect(stack.isFull()).toEqual(false);
  });

  it("can't blow up trying to pop on an empty stack", () => {
    expect(stack.pop()).toEqual(undefined);
  });
});
