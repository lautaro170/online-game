import {SwordClient} from "./entities/SwordClient";
import {Scene} from "phaser";
import {Player} from "../shared/entities/Player";
import {BowClient} from "./entities/BowClient";

export const ItemRegistry= {
    //active items
    "Sword" : (scene:Scene, player :Player) => new SwordClient(scene, player),
    "Bow" : (scene:Scene, player :Player) => new BowClient(scene, player),
}