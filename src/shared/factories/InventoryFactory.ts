import {InventorySchema} from "../../server/state/MyRoomState";
import {Inventory} from "../entities/Inventory";
import {Item} from "../entities/Item";

export class InventoryFactory{
    static createInventory(InventorySchema: InventorySchema){
        let inventory =  new Inventory();
        inventory.items = InventorySchema.items?.map(itemName => new Item(itemName)) ?? [];
        inventory.selectedItemIndex = InventorySchema.selectedItemIndex;
        return inventory;
    }
}