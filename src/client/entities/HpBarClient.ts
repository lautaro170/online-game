import Phaser from "phaser";

export class HpBarClient extends Phaser.GameObjects.Container {
    private bar: Phaser.GameObjects.Graphics;
    private maxHp: number;
    private currentHp: number;

    constructor(scene: Phaser.Scene, x: number, y: number, maxHp: number) {
        super(scene, x, y);
        this.maxHp = maxHp;
        this.currentHp = maxHp;

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.add(this.bar);

        this.draw();
        scene.add.existing(this);
    }

    private draw() {
        this.bar.clear();
        const width = 50;
        const height = 5;
        const margin = 2;

        // Background
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(-width / 2, -height / 2, width, height);

        // Health bar
        const healthWidth = (this.currentHp / this.maxHp) * (width - margin * 2);
        this.bar.fillStyle(0xff0000);
        this.bar.fillRect(-width / 2 + margin, -height / 2 + margin, healthWidth, height - margin * 2);
    }

    public updateHp(newHp: number) {
        this.currentHp = newHp;
        this.draw();
    }
}