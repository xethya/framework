import { DynamicWeightedStack } from "../../src/stack";

describe("DynamicWeightedStack", () => {
  describe("with weight of 1", () => {
    let stack: DynamicWeightedStack<number>;

    beforeEach(() => {
      stack = new DynamicWeightedStack<number>(10);
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

    it("can add elements after resizing", () => {
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
      stack.resize(20);
      expect(stack.isFull()).toEqual(false);
      stack.push(11);
      expect(stack.isFull()).toEqual(false);
    });

    it("cannot resize if there are more elements than the new maximum capacity", () => {
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
      expect(() => stack.resize(5)).toThrow(/stack cannot be shrunk/);
    });
  });

  describe("with variable weight", () => {
    let stack: DynamicWeightedStack<{ name: string; weight: number }>;

    beforeEach(() => {
      stack = new DynamicWeightedStack<{ name: string; weight: number }>(10, "weight");
    });

    it("can be instantiated", () => {
      expect(stack.isFull()).toEqual(false);
      expect(stack.isEmpty()).toEqual(true);
    });

    it("can receive an item", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.isFull()).toEqual(false);
      expect(stack.isEmpty()).toEqual(false);
    });

    it("can receive multiple items", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      expect(stack.push({ name: "Baz", weight: 2 })).toEqual(true);
      expect(stack.isFull()).toEqual(false);
      expect(stack.isEmpty()).toEqual(false);
    });

    it("can't receive an element if it doesn't fit", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      expect(stack.push({ name: "Baz", weight: 2 })).toEqual(true);
      expect(stack.push({ name: "Baz", weight: 5 })).toEqual(false);
      expect(stack.isFull()).toEqual(false);
      expect(stack.isEmpty()).toEqual(false);
    });

    it("can remove a single item", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      stack.pop();
      expect(stack.isFull()).toEqual(false);
      expect(stack.isEmpty()).toEqual(false);
    });

    it("can remove multiple items", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      stack.pop();
      stack.pop();
      expect(stack.isFull()).toEqual(false);
      expect(stack.isEmpty()).toEqual(true);
    });

    it("can add elements after resizing", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      expect(stack.push({ name: "Baz", weight: 3 })).toEqual(true);
      expect(stack.isFull()).toEqual(true);
      stack.resize(20);
      expect(stack.isFull()).toEqual(false);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      expect(stack.isFull()).toEqual(false);
    });

    it("cannot resize if there are more elements than the new maximum capacity", () => {
      expect(stack.push({ name: "Foo", weight: 3 })).toEqual(true);
      expect(stack.push({ name: "Bar", weight: 4 })).toEqual(true);
      expect(() => stack.resize(5)).toThrow(/stack cannot be shrunk/);
    });
  });
});
