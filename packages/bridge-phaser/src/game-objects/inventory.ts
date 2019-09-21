import { Inventory, InventoryOptions } from "@xethya/inventory";
import { GameObjects, Scene } from "phaser";

export class InventoryGameObject extends GameObjects.GameObject {
  public readonly inventory: Inventory;

  constructor(scene: Scene, options: InventoryOptions) {
    super(scene, "inventory");

    this.inventory = new Inventory(options);
  }
}
