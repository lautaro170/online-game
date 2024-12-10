import {Item} from "../entities/Item";
import {ItemSchema} from "../../server/state/MyRoomState";

export class ItemFactory{
    static createItem(itemSchema: ItemSchema){

        let item = new Item(itemSchema.name);
        item.setCooldown(itemSchema.cooldown, itemSchema.lastUsed);

        return item;
    }
}