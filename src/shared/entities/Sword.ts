import { Item } from "./Item";

export class Sword extends Item {
    damage: number;
    range: number;
    swingAngle: number;

    constructor() {
        super("Sword");
        this.damage = 10;
        this.range = 20; // example range
        this.swingAngle = Math.PI / 4; // example angle (45 degrees)
    }
}