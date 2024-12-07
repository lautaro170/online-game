import {Scene} from "phaser";
import {MyRoomState} from "../state/MyRoomState";

export class GameService{
    state: MyRoomState;

    constructor(state: MyRoomState) {
        this.state = state;
    }



}