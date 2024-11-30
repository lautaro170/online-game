import Phaser from "phaser";
import {PlayerClient} from "./PlayerClient";

export class SwordClient extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x + 20, y, 20, 5, 0xff0000); // Position the sword to the right of the player
        this.setOrigin(0, 0.5); // Set the origin to the left side of the sword
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(playerClient: PlayerClient) {
        // Update the sword position to follow the player
        this.x = playerClient.x + 20;
        this.y = playerClient.y;
    }
    swing() {
        this.scene.tweens.add({
            targets: this,
            angle: { from: -45, to: 45 },
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.angle = 0;
            }
        });
    }
}