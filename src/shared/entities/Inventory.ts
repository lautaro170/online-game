// src/shared/entities/Inventory.ts
import { Item } from "./Item";

export class Inventory {
    items: Item[] = [];
    selectedItemIndex: number = 0;

    addItem(item: Item, index: number) {
        this.items[index] = item;
    }

    getSelectedItem(): Item | null {
        console.log("selected item index", this.selectedItemIndex);
        console.log("items", this.items);
        return this.items[this.selectedItemIndex] ?? null;

    }

    selectItem(index: number) {
        if (index >= 0 && index < this.items.length) {
            this.selectedItemIndex = index;
        }
    }
}