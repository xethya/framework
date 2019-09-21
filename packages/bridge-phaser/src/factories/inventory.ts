import { InventoryOptions } from "@xethya/inventory";
import { GameObjects } from "phaser";
import { InventoryGameObject } from "../game-objects/inventory";

export function inventoryFactory(this: GameObjects.GameObjectFactory, options: InventoryOptions): InventoryGameObject {
  return this.scene.add.existing(new InventoryGameObject(this.scene, options)) as InventoryGameObject;
}

export function inventoryCreator(
  this: GameObjects.GameObjectCreator,
  config: any = {},
  addToScene?: boolean,
): InventoryGameObject {
  const getAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;

  config.add = addToScene;
  const options: any = getAdvancedValue(config, "options", {});

  const inventoryGameObject = new InventoryGameObject(this.scene, options);

  GameObjects.BuildGameObject(this.scene, inventoryGameObject, config);

  return inventoryGameObject;
}
