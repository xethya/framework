import { InventoryOptions } from "@xethya/inventory";
import { expect } from "chai";
import "mocha";
import { AUTO, Game, Plugins, Scene, Types } from "phaser";
import { DieGameObject } from "../src/game-objects/die";
import { InventoryGameObject } from "../src/game-objects/inventory";
import { XethyaPlugin } from "../src/index";

type XethyaGameObjectFactory = XethyaDiceGameObjects & XethyaInventoryGameObjects;

type XethyaInventoryGameObjects = {
  inventory(options?: InventoryOptions): InventoryGameObject;
};

type XethyaDiceGameObjects = {
  die(faces?: number): DieGameObject;
  coinFlip(): DieGameObject;
  d4(): DieGameObject;
  d6(): DieGameObject;
  d8(): DieGameObject;
  d10(): DieGameObject;
  d12(): DieGameObject;
  d20(): DieGameObject;
  d100(): DieGameObject;
};

declare module "phaser" {
  namespace GameObjects {
    interface GameObjectFactory extends XethyaGameObjectFactory {}
  }
}

declare var window: { game: Game };

const baseConfig = {
  banner: false,
  height: 10,
  width: 10,
  plugins: {
    global: [
      {
        key: "XethyaPlugin",
        plugin: XethyaPlugin,
        start: true,
      },
    ],
  },
  type: AUTO,
};

describe("Bridge: Phaser", () => {
  let config: Types.Core.GameConfig;

  beforeEach(() => {
    Plugins.PluginCache.destroyCustomPlugins();
  });

  it("should be installed", done => {
    config = { ...baseConfig, scene: { create } };

    function create(this: Scene) {
      expect(this.plugins.isActive("XethyaPlugin")).to.be.true;
      done();
    }

    window.game = new Game(config);
  });

  describe("Die extension", () => {
    function simulateWith(key: keyof XethyaDiceGameObjects, done: (err?: string) => void, faces?: number) {
      config = { ...baseConfig, scene: { create } };

      function create(this: Scene) {
        const die = this.add[key](faces);
        const roll = die.roll();
        console.log(key, "Rolled!", roll);
        expect(!isNaN(roll), "Roll failed").to.be.true;
        done();
      }

      return config;
    }

    it("should be able to roll a custom die", done => {
      window.game = new Game(simulateWith("die", done, 37));
    });

    it("should be able to roll a coin flip", done => {
      window.game = new Game(simulateWith("coinFlip", done));
    });

    it("should be able to roll a d4", done => {
      window.game = new Game(simulateWith("d4", done));
    });

    it("should be able to roll a d6", done => {
      window.game = new Game(simulateWith("d6", done));
    });

    it("should be able to roll a d8", done => {
      window.game = new Game(simulateWith("d8", done));
    });

    it("should be able to roll a d10", done => {
      window.game = new Game(simulateWith("d10", done));
    });

    it("should be able to roll a d12", done => {
      window.game = new Game(simulateWith("d12", done));
    });

    it("should be able to roll a d20", done => {
      window.game = new Game(simulateWith("d20", done));
    });

    it("should be able to roll a d100", done => {
      window.game = new Game(simulateWith("d100", done));
    });
  });

  describe("Inventory extension", () => {
    it("should be able to use a default inventory", done => {
      config = { ...baseConfig, scene: { create } };

      function create(this: Scene) {
        const inventoryGameObject = this.add.inventory();
        inventoryGameObject.inventory.put({ id: "1", weight: 3 });
        expect(inventoryGameObject.inventory.getAvailableSpace()).to.equal(97);
        done();
      }

      window.game = new Game(config);
    });

    it("should be able to use a customized inventory", done => {
      config = { ...baseConfig, scene: { create } };

      function create(this: Scene) {
        let dynamicFactor = 3;
        const inventoryGameObject = this.add.inventory({ capacityProvider: () => dynamicFactor * 10 });
        inventoryGameObject.inventory.put({ id: "1", weight: 3 });
        expect(inventoryGameObject.inventory.getAvailableSpace()).to.equal(27);
        dynamicFactor = 5;
        expect(inventoryGameObject.inventory.getAvailableSpace()).to.equal(47);
        done();
      }

      window.game = new Game(config);
    });
  });
});
