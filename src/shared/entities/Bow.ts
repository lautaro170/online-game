import {CooldownComponent} from "./components/CooldownComponent";
import {Item} from "./Item";

export class Bow extends Item{
    static baseRange: number = 300;
    static baseDamage: number = 15;
    static baseCooldown: number = 1000; // in milliseconds

    canShoot(): boolean {
        return true;
    }
}