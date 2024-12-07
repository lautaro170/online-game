import Phaser from "phaser";
import { PlayerClient } from "./PlayerClient";
import { Bow } from "../../shared/entities/Bow";
import { Arrow } from "../../shared/entities/Arrow";
import {Player} from "../../shared/entities/Player";
import {ItemClient} from "../interfaces/ItemClient";

export class BowClient extends Phaser.GameObjects.Container implements ItemClient {
    name = "Bow";
    private bow: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.x, player.y);
        this.bow = new Phaser.GameObjects.Image(scene, 0, 0, "bow");
        this.add(this.bow);

        scene.add.existing(this);
    }

    use(){
        return;
    }

    update(playerClient: PlayerClient) {
        this.setPosition(playerClient.x, playerClient.y);
        this.setRotation(playerClient.rotation);
    }
}