import {Item} from "./Item";
import {Sword} from "./Sword";

export interface InputData{
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    tick: number;
}


export class Player{
    x: number;
    y: number;
    hp: number;
    velocity: number;
    inputQueue: InputData[];
    tick: number;
    inventory: Item[];

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
        this.hp = 100;
        this.velocity = 10;
        this.tick = 0;
        this.inputQueue = [];
        this.inventory = [];
    }

    //add a new input to the queue
    addInput(input: InputData){
        this.inputQueue.push(input);
    }

    //process the input queue
    processInputQueue(){
        let input: InputData;

        //dequeue player inputs
        while(input = this.inputQueue.shift()){
            if(input.left){
                this.x -= this.velocity;
            }else if(input.right){
                this.x += this.velocity;
            }

            if(input.up){
                this.y -= this.velocity;
            }else if(input.down){
                this.y += this.velocity;
            }

            this.tick = input.tick;
        }
    }

    addItem(item: Item) {
        this.inventory.push(item);
    }

    removeItem(item: Item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
    }

    swingSword(): boolean {
        console.log("trying to swing sword -- player", "inventory", this.inventory);

        return true;
    }

}