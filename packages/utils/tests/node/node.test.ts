import { Node } from "../../src/node";

describe("Node", () => {
  it("can be instantiated", () => {
    const node = new Node<number>(10);
    expect(node.value).toEqual(10);

    const strNode = new Node<string>("foo");
    expect(strNode.value).toEqual("foo");
  });
});
