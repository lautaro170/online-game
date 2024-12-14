import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";
import {Player} from "../../shared/entities/Player";
import {GameService} from "./GameService";


export class StatsIncreaserService implements UsableItemServiceInterface{

    statsIncreases: [string, number][];
    constructor(statsIncreases: [string, number][]) {
        this.statsIncreases = statsIncreases;
    }
    use(player: Player, gameService : GameService){

        for(let i = 0; i < this.statsIncreases.length; i++){
            this.increaseStat(player, this.statsIncreases[i][0], this.statsIncreases[i][1]);
        }
    }

    canUse(player:Player, gameService:GameService){
        return true;
    }

    private increaseStat(player: Player, statName : string, amount : number){

        switch(statName){
            case "hpMultiplier":
                player.playerStats.hpMultiplier *= amount;
                break;
            case "regenSpeed":
                player.playerStats.regenSpeed += amount;
                break;
            case "damageMultiplier":
                player.playerStats.damageMultiplier *= amount;
                break;
            case "rangeMultiplier":
                player.playerStats.rangeMultiplier *= amount;
                break;
            case "attackSpeedMultiplier":
                player.playerStats.attackSpeedMultiplier *= amount;
                break;
            case "projectileSpeedMultiplier":
                player.playerStats.projectileSpeedMultiplier *= amount;
                break;
            case "movementSpeedMultiplier":
                player.playerStats.movementSpeedMultiplier *= amount;
                break;
            case "visionMultiplier":
                player.playerStats.visionMultiplier *= amount;
                break;
            case "attackRangeMultiplier":
                player.playerStats.attackRangeMultiplier *= amount;
                break;
            case "attackSizeMultiplier":
                player.playerStats.attackSizeMultiplier *= amount;
                break;
            default:
                console.error("Invalid stat name");
        }

    }


}