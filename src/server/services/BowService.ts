import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";
import {GameService} from "./GameService";
import {Player} from "../../shared/entities/Player";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {Arrow} from "../../shared/entities/Arrow";
import {ArrowSchema} from "../state/MyRoomState";

export class BowService implements UsableItemServiceInterface {
    canUse(player: Player, gameService: GameService): boolean {
        return player.inventory.selectedItemIndex === player.inventory.items.findIndex(item => item.name === "Bow");
    }

    use(player: Player, gameService: GameService): void {

        const playerSchema = gameService.state.players.get(player.sessionId);
        if (!playerSchema) return;

        if (player.bow.canShoot()) {
            const arrow = new Arrow(player.x, player.y, player.rotation, player.sessionId);
            const arrowSchema = ArrowSchema.fromArrow(arrow);
            gameService.state.arrows.push(arrowSchema);
            console.log("added arrow id", arrowSchema.id);
            console.log("Player", player.sessionId, "shot an arrow!");
        }

    }
}