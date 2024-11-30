import { MapSchema, Schema, type } from "@colyseus/schema";
import {Player} from "../../shared/entities/Player";
import {Item} from "../../shared/entities/Item";

export interface InputData {
    left: false;
    right: false;
    up: false;
    down: false;
    tick: number;
}

export class ItemSchema extends Schema {
    @type("string") name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    fromItem(item: Item) {
        this.name = item.name;
    }
}

export class PlayerSchema extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") hp: number;
    @type("number") tick: number;
    @type([ItemSchema]) inventory: ItemSchema[] = [];

    inputQueue: InputData[] = [];

    fromPlayer(player: Player) {
        this.x = player.x;
        this.y = player.y;
        this.hp = player.hp;
        this.tick = player.inputQueue.length > 0 ? player.inputQueue[player.inputQueue.length - 1].tick : this.tick;
        this.inventory = player.inventory.map(item => {
            const itemSchema = new ItemSchema(item.name);
            itemSchema.fromItem(item);
            return itemSchema;
        });

    }

}

export class MyRoomState extends Schema {
    @type("number") mapWidth: number;
    @type("number") mapHeight: number;

    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();

}
