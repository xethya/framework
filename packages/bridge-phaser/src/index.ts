import { Plugins } from "phaser";
import { dieCreator, dieCreatorFor, dieFactory, dieFactoryFor } from "./factories/dice";
import { inventoryCreator, inventoryFactory } from "./factories/inventory";

export class XethyaPlugin extends Plugins.BasePlugin {
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);

    // Register @xethya/dice
    pluginManager.registerGameObject("die", dieFactory, dieCreator);
    pluginManager.registerGameObject("coinFlip", dieFactoryFor(2), dieCreatorFor(2));
    pluginManager.registerGameObject("d4", dieFactoryFor(4), dieCreatorFor(4));
    pluginManager.registerGameObject("d6", dieFactoryFor(6), dieCreatorFor(6));
    pluginManager.registerGameObject("d8", dieFactoryFor(8), dieCreatorFor(8));
    pluginManager.registerGameObject("d10", dieFactoryFor(10), dieCreatorFor(10));
    pluginManager.registerGameObject("d12", dieFactoryFor(12), dieCreatorFor(12));
    pluginManager.registerGameObject("d20", dieFactoryFor(20), dieCreatorFor(20));
    pluginManager.registerGameObject("d100", dieFactoryFor(100), dieCreatorFor(100));

    // Register @xethya/inventory
    pluginManager.registerGameObject("inventory", inventoryFactory, inventoryCreator);
  }
}
