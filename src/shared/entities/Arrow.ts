import {Player} from "./Player";

export class Arrow {
    x: number;
    y: number;
    rotation: number;
    speed: number = 500;
    damage: number = 15;
    ownerId: string;


    constructor(x: number, y: number, rotation: number, ownerId: string) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.ownerId = ownerId;
    }

    update(delta: number) {
        this.x += Math.cos(this.rotation) * this.speed * delta;
        this.y += Math.sin(this.rotation) * this.speed * delta;
    }

    checkCollision(target: Player): boolean {
        const distance = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));
        return distance < 10; // Example collision radius
    }

}