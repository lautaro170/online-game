import Phaser from "phaser";
import { Player } from "../../shared/entities/Player";
import { SwordClient } from "./SwordClient";
import {HpBarClient} from "./HpBarClient";
import {BowClient} from "./BowClient";
import {InventoryClient} from "./InventoryClient";
import {ItemClient} from "../interfaces/ItemClient";
import {ItemRegistry} from "../ItemRegistry";

export class PlayerClient extends Phaser.GameObjects.Rectangle {
    player: Player;
    sword: SwordClient;
    hpBar: HpBarClient;
    inventory: InventoryClient;
    selectedItem: ItemClient;


    constructor(scene: Phaser.Scene, player: Player, currentSessionId : string ) {
        super(scene, player.x, player.y, 20, 20, 0x00ff00); // Example dimensions and color
        this.player = player;
        this.hpBar = new HpBarClient(scene, player.x, player.y - 20, player.hp); // Position the HP bar above the player
        this.reloadSelectedItem();
        if(player.sessionId === currentSessionId) {
            this.inventory = new InventoryClient(scene, player.inventory);
        }
        scene.add.existing(this);
    }


    update(currentSessionId: string) {
        this.x = Phaser.Math.Linear(this.x, this.player.x, 0.2);
        this.y = Phaser.Math.Linear(this.y, this.player.y, 0.2);
        this.setRotation(this.player.rotation);
        this.hpBar.setPosition(this.x, this.y - 20); // Update HP bar position
        this.hpBar.updateHp(this.player.hp); // Update HP bar value

        this.reloadSelectedItem();
        this.selectedItem.update(this);
        // Update inventory HUD only for the current player
        if (this.player.sessionId === currentSessionId) {
            console.log("updating inventory for user", this.player.sessionId);
            this.inventory.update(this.player.inventory);
        }

    }

    playUseItemAnimation() {
        this.selectedItem.use();
    }

    private reloadSelectedItem(){
        if(this.player.getSelectedItem().name === this.selectedItem?.name){
            return;
        }

        if(this.selectedItem){
            this.selectedItem.destroy();
        }
        this.selectedItem = ItemRegistry[this.player.inventory.getSelectedItem().name](this.scene, this.player);
    }
}