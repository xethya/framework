import { Creature } from "../src/creature";

describe("Creature", () => {
  it("can be instantiated", () => {
    expect(new Creature()).toBeDefined();
  });
});
