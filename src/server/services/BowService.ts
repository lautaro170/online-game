import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";
import {GameService} from "./GameService";
import {Player} from "../../shared/entities/Player";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {Arrow} from "../../shared/entities/Arrow";
import {ArrowSchema} from "../state/MyRoomState";
import {Bow} from "../../shared/entities/Bow";

export class BowService implements UsableItemServiceInterface {
    canUse(player: Player, gameService: GameService): boolean {
        return player.getSelectedItem().canUse();
    }

    use(player: Player, gameService: GameService): void {
        if(player.getSelectedItem().getCooldown() === 0){
            player.getSelectedItem().setCooldown(Bow.baseCooldown);
        }

        if (this.canUse(player, gameService)) {
            player.getSelectedItem().use();
            const arrow = new Arrow(player.x, player.y, player.rotation, player.sessionId);
            const arrowSchema = ArrowSchema.fromArrow(arrow);
            gameService.state.arrows.push(arrowSchema);
            console.log("added arrow id", arrowSchema.id);
            console.log("Player", player.sessionId, "shot an arrow!");
        }

    }
}