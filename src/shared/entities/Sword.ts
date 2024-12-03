import { Item } from "./Item";

export class Sword extends Item {
    static baseDamage: number = 10;
    static baseRange: number = 50;
    static baseSwingAngle: number = 90;
    static baseSwingSpeed: number = 1;

    constructor() {
        super("Sword");
    }
}