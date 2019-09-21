import { GameObjects } from "phaser";
import { DieGameObject } from "../game-objects/die";

export function dieFactoryFor(faces: number = 6) {
  return function(this: GameObjects.GameObjectFactory): DieGameObject {
    return this.scene.add.existing(new DieGameObject(this.scene, faces)) as DieGameObject;
  };
}

export function dieFactory(this: GameObjects.GameObjectFactory, faces: number = 6): DieGameObject {
  return this.scene.add.existing(new DieGameObject(this.scene, faces)) as DieGameObject;
}

export function dieCreatorFor(faces: number = 6) {
  return function(this: GameObjects.GameObjectCreator, config: any = {}, addToScene?: boolean): DieGameObject {
    config.add = addToScene;
    const dieGameObject = new DieGameObject(this.scene, faces);

    GameObjects.BuildGameObject(this.scene, dieGameObject, config);

    return dieGameObject;
  };
}

export function dieCreator(this: GameObjects.GameObjectCreator, config: any = {}, addToScene?: boolean): DieGameObject {
  const getAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;

  config.add = addToScene;
  const faces: any = getAdvancedValue(config, "faces", 6);

  const dieGameObject = new DieGameObject(this.scene, faces);

  GameObjects.BuildGameObject(this.scene, dieGameObject, config);

  return dieGameObject;
}
