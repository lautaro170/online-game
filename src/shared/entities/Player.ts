import {Item} from "./Item";
import {Sword} from "./Sword";
import {Bow} from "./Bow";
import {Inventory} from "./Inventory";

export interface InputData{
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    mouseX: number;
    mouseY: number;
    mouseClick: boolean;
    tick: number;
    selectedItemIndex: number;
}


export class Player{
    sessionId: string;
    x: number;
    y: number;
    rotation: number;
    hp: number;
    velocity: number;
    inputQueue: InputData[];
    tick: number;
    inventory: Inventory = new Inventory();
    bow: Bow = new Bow();

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
        this.hp = 100;
        this.rotation = 0;
        this.velocity = 10;
        this.tick = 0;
        this.inputQueue = [];
        this.inventory.addItem(new Item("Sword"), 0);
        this.inventory.addItem(new Item("Bow"), 1);

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

            //make the player look at the direction of the mouse based on input.mouseX and input.mouseY
            this.rotation = Math.atan2(input.mouseY - this.y, input.mouseX - this.x);
            this.inventory.selectItem(input.selectedItemIndex);
            this.tick = input.tick;
        }
    }

    getSelectedItem(): Item | null {
        return this.inventory.getSelectedItem();
    }

    swingSword(): boolean {
        console.log("trying to swing sword -- player", "inventory", this.inventory);

        return true;
    }

}