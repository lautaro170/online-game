import {PlayerSchema} from "../../server/state/MyRoomState";
import {Player} from "../entities/Player";
import {InventoryFactory} from "./InventoryFactory";

export class PlayerFactory {
    static createPlayer(playerSchema :PlayerSchema):Player {
        const player = new Player(playerSchema.x, playerSchema.y);
        player.currentHp = playerSchema.currentHp;
        player.rotation = playerSchema.rotation;
        player.inputQueue = playerSchema.inputQueue ?? [];
        player.sessionId = playerSchema.sessionId;
        player.inventory = InventoryFactory.createInventory(playerSchema.inventory);


        return player;
    }
}