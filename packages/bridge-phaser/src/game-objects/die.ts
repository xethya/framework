import { Die } from "@xethya/dice";
import { GameObjects, Scene } from "phaser";

export class DieGameObject extends GameObjects.GameObject {
  public readonly die: Die;

  constructor(scene: Scene, faces: number) {
    super(scene, "die");

    this.die = new Die(faces, {
      randomizer: {
        generateRandom() {
          return Math.random();
        },
      },
    });
  }
}
