import {Player} from "../../shared/entities/Player";
import {GameService} from "./GameService";
import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";
import {Wall} from "../../shared/entities/Wall";

export class WallPlacerService implements UsableItemServiceInterface {
    use(player: Player, gameService: GameService) {
        if (this.canUse(player, gameService)) {
            const wallHp = 100 * player.playerStats.damageMultiplier;
            const wall = new Wall(player.x, player.y, wallHp);
            gameService.addWall(wall)
        }
    }
    canUse(player: Player, gameService:GameService) {
        return player.getSelectedItem().canUse();
    }
}