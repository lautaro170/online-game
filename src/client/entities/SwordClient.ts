import Phaser from "phaser";
import { PlayerClient } from "./PlayerClient";
import {Sword} from "../../shared/entities/Sword";
import {Player} from "../../shared/entities/Player";
import {ItemClient} from "../interfaces/ItemClient";

export class SwordClient extends Phaser.GameObjects.Rectangle implements ItemClient{
    name = "Sword";
    private isSwinging: boolean = false;
    private playerRotation: number = 0;

    constructor(scene: Phaser.Scene, player:Player) {
       //use Sword.baseRange and Sword.baseSwingAngle, and sword.baseSize
        super(scene, player.x + 20, player.y, Sword.baseRange, 5, 0xff0000); // Position the sword to the right of the player

        this.setOrigin(0, 0.5); // Set the origin to the left side of the sword
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(playerClient: PlayerClient) {
        // Calculate the sword's position based on the player's rotation
        const offsetX = Math.cos(playerClient.rotation) * 20;
        const offsetY = Math.sin(playerClient.rotation) * 20;
        this.x = playerClient.x + offsetX;
        this.y = playerClient.y + offsetY;

        // Update the rotation based on the player's rotation
        if (!this.isSwinging) {
            this.setRotation(playerClient.rotation);
        } else {
            this.setRotation(playerClient.rotation + (this.rotation - this.playerRotation));
        }
    }

    use() {
        this.swing();
    }
    swing() {
        this.playerRotation = this.rotation;
        this.isSwinging = true;
        this.scene.tweens.add({
            targets: this,
            rotation: { from: this.playerRotation - Phaser.Math.DegToRad(Sword.baseSwingAngle/2), to: this.playerRotation + Phaser.Math.DegToRad(Sword.baseSwingAngle/2) },
            duration: Sword.baseCooldown,
            yoyo: true,
            onComplete: () => {
                this.isSwinging = false;
            }
        });
    }
}