import Phaser from "phaser";
import { Player } from "../../shared/entities/Player";
import { SwordClient } from "./SwordClient";

export class PlayerClient extends Phaser.GameObjects.Rectangle {
    player: Player;
    sword: SwordClient;

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.x, player.y, 20, 20, 0x00ff00); // Example dimensions and color
        this.player = player;
        this.sword = new SwordClient(scene, player.x, player.y);
        scene.add.existing(this);
    }


    update() {
        this.x = Phaser.Math.Linear(this.x, this.player.x, 0.2);
        this.y = Phaser.Math.Linear(this.y, this.player.y, 0.2);
        this.sword.update(this);
    }

    playAttackAnimation() {
        this.sword.swing();
    }
}