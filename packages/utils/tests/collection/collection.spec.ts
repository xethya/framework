import Collection from "../../src/collection";

class MyItem {
  key: string;
  name: string;

  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
  }
}

const itemList: MyItem[] = [new MyItem("1", "a"), new MyItem("2", "b")];
const largeItemList: MyItem[] = [
  new MyItem("1", "a"),
  new MyItem("2", "b"),
  new MyItem("3", "c"),
  new MyItem("4", "d"),
  new MyItem("5", "e"),
  new MyItem("6", "f"),
  new MyItem("7", "g"),
  new MyItem("8", "h"),
];

let collection: Collection<MyItem>;

describe("Utils.Collection", () => {
  beforeEach(() => {
    collection = new Collection<MyItem>("key");
  });
  it("should instantiate the collection", () => {
    expect(collection.indexName).toEqual("key");
  });
  describe("#add", () => {
    it("should add an item", () => {
      expect(collection.count).toEqual(0);
      collection.add(new MyItem("123", "An item"));
      expect(collection.count).toEqual(1);
    });
    it("should add multiple items", () => {
      expect(collection.count).toEqual(0);
      collection.add(new MyItem("123", "An item"));
      collection.add(new MyItem("124", "An item 2"));
      collection.add(new MyItem("125", "An item 3"));
      collection.add(new MyItem("126", "An item 4"));
      expect(collection.count).toEqual(4);
    });
    it("should throw an error when adding items with a duplicate key", () => {
      collection.add(new MyItem("123", "An item"));
      expect(() => {
        collection.add(new MyItem("123", "An item 2"));
      }).toThrow(/item already exists/);
    });
    it("should trigger `before:add` when adding items", done => {
      collection.onBeforeAdd((affectedCollection, ...items: MyItem[]) => {
        expect(items).toEqual(itemList);
        done();
      });
      collection.add(...itemList);
    });
    it("should trigger `add` after adding items", done => {
      collection.onAdd((affectedCollection: Collection<MyItem>) => {
        expect(affectedCollection.count).toEqual(2);
        done();
      });
      collection.add(...itemList);
    });
  });
  describe("#remove", () => {
    beforeEach(() => {
      collection.add(...itemList);
    });
    it("should remove an item by its key", () => {
      collection.remove("1");
      expect(collection.contains("1")).toBe(false);
      expect(collection.count).toEqual(itemList.length - 1);
    });
    it("should do nothing if trying to remove a non-existing key", () => {
      collection.remove("key");
      expect(collection.count).toEqual(itemList.length);
    });
    it("should trigger `before:remove` when removing an item", done => {
      collection.onBeforeRemove((affectedCollection: Collection<MyItem>, item: MyItem) => {
        expect(item.key).toEqual("1");
        expect(collection.contains("1")).toBe(true);
        expect(collection.count).toEqual(itemList.length);
        done();
      });
      collection.remove("1");
    });
    it("should trigger `remove` after removing an item", done => {
      collection.onRemove((affectedCollection: Collection<MyItem>, item: MyItem) => {
        expect(item.key).toEqual("1");
        expect(collection.contains("1")).toBe(false);
        expect(collection.count).toEqual(itemList.length - 1);
        done();
      });
      collection.remove("1");
    });
  });
  describe("#removeAll", () => {
    beforeEach(() => {
      collection.add(...itemList);
    });
    it("should clear the list when executing removeAll()", () => {
      collection.removeAll();
      expect(collection.contains("1")).toBe(false);
      expect(collection.contains("2")).toBe(false);
      expect(collection.count).toEqual(0);
    });
    it("should trigger `before:removeAll` when clearing", done => {
      collection.onBeforeRemoveAll((affectedCollection: Collection<MyItem>) => {
        expect(collection.contains("1")).toBe(true);
        expect(collection.contains("2")).toBe(true);
        expect(collection.count).toEqual(2);
        done();
      });
      collection.removeAll();
    });
    it("should trigger `removeAll` when clearing", done => {
      collection.onRemoveAll((affectedCollection: Collection<MyItem>) => {
        expect(collection.contains("1")).toBe(false);
        expect(collection.contains("2")).toBe(false);
        expect(collection.count).toEqual(0);
        done();
      });
      collection.removeAll();
    });
  });
  describe("#get", () => {
    beforeEach(() => {
      collection.add(...itemList);
    });
    it("should get an item by its key", () => {
      expect(collection.get("1")).toEqual(itemList[0]);
      expect(collection.get("2")).toEqual(itemList[1]);
    });
    it("should return undefined for a non-existing key", () => {
      expect(collection.get("foo")).toBe(undefined);
    });
  });
  describe("#getAll", () => {
    beforeEach(() => {
      collection.add(...itemList);
    });
    it("should get all the collection as an array of T", () => {
      const myItems: MyItem[] = collection.getAll();
      expect(myItems).toEqual(itemList);
    });
    it("should return an empty array if the list is empty", () => {
      collection.removeAll();
      expect(collection.getAll()).toEqual([]);
    });
  });
  describe("#getAllKeys", () => {
    beforeEach(() => {
      collection.add(...itemList);
    });
    it("should return all keys in the collection", () => {
      expect(collection.getAllKeys()).toEqual(["1", "2"]);
    });
  });
  describe("#where", () => {
    beforeEach(() => {
      collection.add(...itemList);
    });
    it("should return matches for a fulfilled condition", () => {
      const isEven = (item: MyItem) => Number(item.key) % 2 === 0;
      const evenKeys = collection.where(isEven);

      expect(evenKeys.length).toEqual(1);
      expect(evenKeys[0].key).toEqual("2");
    });
    it("should return an empty array for a non-fulfilled condition", () => {
      const isC = (item: MyItem) => item.key === "C";
      const evenKeys = collection.where(isC);

      expect(evenKeys.length).toEqual(0);
    });
  });
  describe("Collection#fromArray", () => {
    it("should create a collection based on T[]", () => {
      collection = Collection.fromArrayOf<MyItem>([new MyItem("a", "Alpha"), new MyItem("b", "Beta")], "key");
      expect(collection.indexName).toEqual("key");
      expect(collection.count).toEqual(2);
    });
  });
});
