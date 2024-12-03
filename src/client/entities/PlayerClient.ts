import Phaser from "phaser";
import { Player } from "../../shared/entities/Player";
import { SwordClient } from "./SwordClient";
import {HpBarClient} from "./HpBarClient";

export class PlayerClient extends Phaser.GameObjects.Rectangle {
    player: Player;
    sword: SwordClient;
    hpBar: HpBarClient;


    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.x, player.y, 20, 20, 0x00ff00); // Example dimensions and color
        this.player = player;
        this.sword = new SwordClient(scene, player.x, player.y);
        this.hpBar = new HpBarClient(scene, player.x, player.y - 20, player.hp); // Position the HP bar above the player
        scene.add.existing(this);
    }


    update() {
        this.x = Phaser.Math.Linear(this.x, this.player.x, 0.2);
        this.y = Phaser.Math.Linear(this.y, this.player.y, 0.2);
        this.setRotation(this.player.rotation);
        this.hpBar.setPosition(this.x, this.y - 20); // Update HP bar position
        this.hpBar.updateHp(this.player.hp); // Update HP bar value
        this.sword.update(this);
    }

    playAttackAnimation() {
        this.sword.swing();
    }
}