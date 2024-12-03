import Phaser from "phaser";
import { PlayerClient } from "./PlayerClient";
import { Bow } from "../../shared/entities/Bow";
import { Arrow } from "../../shared/entities/Arrow";

export class BowClient extends Phaser.GameObjects.Container {
    private bow: Phaser.GameObjects.Image;
    private arrows: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.bow = new Phaser.GameObjects.Image(scene, 0, 0, "bow");
        this.add(this.bow);

        this.arrows = scene.physics.add.group({
            classType: Phaser.GameObjects.Image,
            defaultKey: "arrow",
            maxSize: 10,
        });

        scene.add.existing(this);
    }

    shoot(playerClient: PlayerClient) {
        if (playerClient.player.bow.canShoot()) {
            const arrow = this.arrows.get(playerClient.x, playerClient.y) as Phaser.GameObjects.Image;
            if (arrow) {
                arrow.setActive(true);
                arrow.setVisible(true);
                arrow.setRotation(playerClient.rotation);
                const velocity = this.scene.physics.velocityFromRotation(playerClient.rotation, 500);
                (arrow.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);
            }
        }
    }

    update(playerClient: PlayerClient) {
        this.setPosition(playerClient.x, playerClient.y);
        this.setRotation(playerClient.rotation);
    }
}