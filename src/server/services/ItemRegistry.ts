import {SwordService} from "./SwordService";
import {BowService} from "./BowService";
import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";

export const ItemRegistry: { [key: string]: () => UsableItemServiceInterface } = {
    "Bow": ()  => new BowService(),
    "Sword": () => new SwordService()
}