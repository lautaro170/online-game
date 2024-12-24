import {SwordService} from "./SwordService";
import {BowService} from "./BowService";
import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";
import {StatsIncreaserService} from "./StatsIncreaserService";
import {WallPlacerService} from "./WallPlacerService";

export const ItemRegistry: { [key: string]: () => UsableItemServiceInterface } = {
    //active items
    "Bow": ()  => new BowService(),
    "Sword": () => new SwordService(),
    "WallPlacer": () => new WallPlacerService(),
    //passive items
    "speedMedallion": () => new StatsIncreaserService([["movementSpeedMultiplier", 1.25]]),

}