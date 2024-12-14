import {InventorySchema} from "../../server/state/MyRoomState";
import {Inventory} from "../entities/Inventory";
import {Item} from "../entities/Item";

export class InventoryFactory{
    static createInventory(InventorySchema: InventorySchema){
        let inventory =  new Inventory();
        inventory.items = InventorySchema.items.map(itemSchema => {
            let item = new Item(itemSchema.name, itemSchema.type);
            item.setCooldown(itemSchema.cooldown, itemSchema.lastUsed);
            return item;
        });
        inventory.selectedItemIndex = InventorySchema.selectedItemIndex;
        return inventory;
    }
}