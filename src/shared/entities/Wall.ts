export class Wall{
    x:number;
    y: number;
    hp: number;

    constructor(x: number, y: number, hp: number = 100) {
        this.x = x;
        this.y = y;
        this.hp = hp;
    }

}