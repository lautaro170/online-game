import {Player} from "../../shared/entities/Player";
import {GameService} from "../services/GameService";

export interface UsableItemServiceInterface {
    use(player: Player, gameService: GameService): void;
    canUse(player: Player, gameService: GameService): boolean;
}