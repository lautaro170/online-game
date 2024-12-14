import {Item} from "./Item";
import {Inventory} from "./Inventory";
import {PlayerStats} from "./PlayerStats";

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
    currentHp = 100;
    velocity: number;
    inputQueue: InputData[];
    tick: number;
    inventory: Inventory = new Inventory();
    playerStats: PlayerStats = new PlayerStats();

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.tick = 0;
        this.inputQueue = [];
        this.inventory.addItem(new Item("Sword"), 0);
        this.inventory.addItem(new Item("Bow"), 1);
        this.inventory.addItem(new Item("speedMedallion", "passive"), 2);
    }

    getMovementSpeed(): number {
        return this.playerStats.getMovementSpeed();
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
                this.x -= this.getMovementSpeed();
            }else if(input.right){
                this.x += this.getMovementSpeed();
            }

            if(input.up){
                this.y -= this.getMovementSpeed();
            }else if(input.down){
                this.y += this.getMovementSpeed();
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
}