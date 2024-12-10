import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {Player} from "../../shared/entities/Player";
import {Item} from "../../shared/entities/Item";
import {Arrow} from "../../shared/entities/Arrow";
import {v4 as uuidv4} from "uuid";
import {Inventory} from "../../shared/entities/Inventory";


export class ItemSchema extends Schema {
    @type("string") name: string;
    @type("number") cooldown: number = 0;
    @type("number") lastUsed: number = 0;

    constructor() {
        super();
    }

    fromItem(item: Item) {
        this.name = item.name;
        this.cooldown = item.getCooldown();
        this.lastUsed = item.getLastUsed();
    }

    static fromItem(item: Item):ItemSchema {
        let itemSchema = new ItemSchema();
        itemSchema.fromItem(item);
        return itemSchema;
    }
}


export class InventorySchema extends Schema {
    @type([ItemSchema]) items = new ArraySchema<ItemSchema>();
    @type("number") selectedItemIndex: number = 0;

    fromInventory(inventory: Inventory) {
        this.items = new ArraySchema<ItemSchema>(...inventory.items.map(item => ItemSchema.fromItem(item)));
        this.selectedItemIndex = inventory.selectedItemIndex;
    }
}

export class ArrowSchema extends Schema {
    @type("string") id: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") rotation: number;
    @type("string") ownerId: string;

    constructor() {
        super();
        this.id = uuidv4();
    }
    static fromArrow(arrow: Arrow):ArrowSchema {
        let arrowSchema =  new ArrowSchema();
        arrowSchema.fromArrow(arrow);
        return arrowSchema;
    }

    fromArrow(arrow: Arrow) {
        this.x = arrow.x;
        this.y = arrow.y;
        this.rotation = arrow.rotation;
        this.ownerId = arrow.ownerId;
    }
}


export interface InputData {
    left: false;
    right: false;
    up: false;
    down: false;
    mouseX: number;
    mouseY: number;
    mouseClick: boolean;
    tick: number;
    selectedItemIndex: number;
}

export class PlayerSchema extends Schema {
    @type("string") sessionId: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") hp: number;
    @type("number") rotation: number;
    @type("number") tick: number;
    @type(InventorySchema) inventory: InventorySchema = new InventorySchema();

    inputQueue: InputData[] = [];

    fromPlayer(player: Player) {
        this.sessionId = player.sessionId;
        this.x = player.x;
        this.y = player.y;
        this.hp = player.hp;
        this.rotation = player.rotation;
        this.tick = player.inputQueue.length > 0 ? player.inputQueue[player.inputQueue.length - 1].tick : this.tick;
        this.inventory.fromInventory(player.inventory);
    }
}

export class MyRoomState extends Schema {
    @type("number") mapWidth: number;
    @type("number") mapHeight: number;

    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    @type([ArrowSchema]) arrows = new ArraySchema<ArrowSchema>();


}
