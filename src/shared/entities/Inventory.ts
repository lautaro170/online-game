// src/shared/entities/Inventory.ts
import {Item} from "./Item";

export class Inventory {
    items: Item[] = [];
    selectedItemIndex: number = 0;

    addItem(item: Item, index: number) {
        this.items[index] = item;
    }

    getActiveItems(): Item[] {
        return this.items.filter(item => item.type === "active");
    }

    getPassiveItems(): Item[] {
        return this.items.filter(item => item.type === "passive");
    }

    getSelectedItem(): Item | null {
        console.log("selected item index", this.selectedItemIndex);
        console.log("items", this.items);
        return this.getActiveItems()[this.selectedItemIndex] ?? null;

    }

    selectItem(index: number) {
        if (index >= 0 && index < this.getActiveItems().length) {
            this.selectedItemIndex = this.getActiveItems().findIndex(item => item === this.items[index]);
        }
    }
}