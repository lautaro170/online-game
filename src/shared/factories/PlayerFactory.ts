import {PlayerSchema} from "../../server/state/MyRoomState";
import {Player} from "../entities/Player";
import {ItemFactory} from "./ItemFactory";

export class PlayerFactory {
    static createPlayer(playerSchema :PlayerSchema):Player {
        const player = new Player(playerSchema.x, playerSchema.y);
        player.hp = playerSchema.hp;
        player.rotation = playerSchema.rotation;
        player.inputQueue = playerSchema.inputQueue ?? [];
        player.sessionId = playerSchema.sessionId;

        playerSchema.inventory.map( itemSchema => {
            const item = ItemFactory.createItem(itemSchema.name);
            player.addItem(item);
        } )

        return player;
    }
}