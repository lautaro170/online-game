// src/shared/entities/Inventory.ts
import { Item } from "./Item";

export class Inventory {
    items: (Item | null)[] = Array(9).fill(null);
    selectedItemIndex: number = 0;

    addItem(item: Item, index: number) {
        if (index >= 0 && index < this.items.length) {
            this.items[index] = item;
        }
    }

    getSelectedItem(): Item | null {
        console.log("selected item index", this.selectedItemIndex);
        console.log("items", this.items);
        return this.items[this.selectedItemIndex];

    }

    selectItem(index: number) {
        if (index >= 0 && index < this.items.length) {
            this.selectedItemIndex = index;
        }
    }
}