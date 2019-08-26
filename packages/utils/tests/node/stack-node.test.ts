import { StackNode } from "../../src/node";

describe("StackNode", () => {
  it("can be instantiated", () => {
    const node = new StackNode<number>(10);
    expect(node.value).toEqual(10);

    const strNode = new StackNode<string>("foo");
    expect(strNode.value).toEqual("foo");
  });
});
