import {PlayerClient} from "../entities/PlayerClient";

export interface ItemClient extends Phaser.GameObjects.GameObject {
    use(): void;
    update(playerClient : PlayerClient) :void;
}