import {Item} from "../entities/Item";

export class ItemFactory{
    static createItem(name: string){
        return new Item(name);
    }
}