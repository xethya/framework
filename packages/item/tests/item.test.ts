import { Item, ITEM_DEFAULT_WEIGHT } from "../src/item";

/**
 * @todo Move this regex to utils.
 * @see https://github.com/xethya/framework/issues/33
 */
const UUID_REGEX = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;

describe("Item", () => {
  describe("Basic instantiation", () => {
    it("can be instantiated with default settings", () => {
      const item = new Item();
      expect(item.id).toMatch(UUID_REGEX);
      expect(item.weight).toEqual(ITEM_DEFAULT_WEIGHT);
    });
  });
});
