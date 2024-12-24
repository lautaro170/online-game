import Phaser from "phaser";

export class WallClient extends Phaser.GameObjects.Image{
    constructor(scene, wall){
        super(scene, wall.x, wall.y, "wall");
        scene.add.existing(this);
    }
    use(){
    }
    update(){
    }
}