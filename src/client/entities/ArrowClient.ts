import Phaser from "phaser";
import {Arrow} from "../../shared/entities/Arrow";

export class ArrowClient extends Phaser.GameObjects.Image {
    arrow: Arrow;

    constructor(scene: Phaser.Scene, arrow: Arrow) {
        super(scene, arrow.x, arrow.y, "arrow");
        this.arrow = arrow;
        scene.add.existing(this);
    }

    update() {
        this.x = this.arrow.x;
        this.y = this.arrow.y;
        this.setRotation(this.arrow.rotation);
    }

    destroy() {
        super.destroy();
    }

}