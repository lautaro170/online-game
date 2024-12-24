import Phaser from "phaser";
import {ItemClient} from "../interfaces/ItemClient";
import {Player} from "../../shared/entities/Player";

export class WallPlacerClient extends Phaser.GameObjects.Container implements ItemClient{
    name = "WallPlacer";
    wallPlacer: Phaser.GameObjects.Image;
    constructor(scene: Phaser.Scene, player:Player) {
        super(scene, 0, 0);
        this.wallPlacer = new Phaser.GameObjects.Image(scene, 0, 0, "wallPlacer");
        this.add(this.wallPlacer);
        scene.add.existing(this);
    }

    use(){
        return;
    }

    update(playerClient: Phaser.GameObjects.Rectangle) {
        this.setPosition(playerClient.x, playerClient.y);
        this.setRotation(playerClient.rotation);
    }
}