// src/client/entities/InventoryClient.ts
import Phaser from "phaser";
import { Inventory } from "../../shared/entities/Inventory";
import { Item } from "../../shared/entities/Item";

export class InventoryClient {
    scene: Phaser.Scene;
    hudElements: Phaser.GameObjects.Rectangle[] = [];
    selectedItemHighlight: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, inventory: Inventory) {
        this.scene = scene;
        this.createHUD(inventory);
    }

    createHUD(inventory: Inventory) {
        for (let i = 0; i < 9; i++) {
            const x = 50 + i * 60;
            const y = this.scene.cameras.main.height - 50;
            const box = this.scene.add.rectangle(x, y, 50, 50, 0x000000).setStrokeStyle(2, 0xffffff);
            this.hudElements.push(box);
            this.scene.add.text(x - 10, y - 10, (i + 1).toString(), { color: "#ffffff" });
        }
        const selectedIndex = inventory.selectedItemIndex;

        this.selectedItemHighlight = this.scene.add.rectangle(50 + selectedIndex * 60, this.scene.cameras.main.height - 50, 50, 50, 0xffffff, 0.2).setStrokeStyle(2, 0xffff00);
    }

    update(inventory:Inventory) {
        console.log("updating HUD, new select item", inventory.selectedItemIndex);
        const selectedIndex = inventory.selectedItemIndex;
        this.selectedItemHighlight.setPosition(50 + selectedIndex * 60, this.scene.cameras.main.height - 50);
    }
}