import {Player} from "../../shared/entities/Player";
import {GameService} from "./GameService";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {Sword} from "../../shared/entities/Sword";
import {UsableItemServiceInterface} from "../interfaces/UsableItemServiceInterface";

export class SwordService implements UsableItemServiceInterface {
    canUse(player: Player, gameService: GameService): boolean {
        return true;
    }

    use(player: Player, gameService: GameService): void {

        console.log("starting swordSwing server")
        const attackerPlayerSchema = gameService.state.players.get(player.sessionId);
        if (!attackerPlayerSchema) return;

        const attackerPlayer = PlayerFactory.createPlayer(attackerPlayerSchema);
        if (attackerPlayer.swingSword()) {
            gameService.state.players.forEach((targetPlayerSchema, sessionId) => {
                if (sessionId === player.sessionId) return;

                const targetPlayer = PlayerFactory.createPlayer(targetPlayerSchema);
                const distance = this.distanceBetweenPlayers(attackerPlayer, targetPlayer);
                console.log("distance", distance);
                if (distance <= Sword.baseRange + 30) {
                    // Calculate the angle between the attacker and the target
                    const angleToTarget = Math.atan2(targetPlayer.y - attackerPlayer.y, targetPlayer.x - attackerPlayer.x);
                    const angleDifference = ((angleToTarget - attackerPlayer.rotation + Math.PI) % (2 * Math.PI)) - Math.PI;

                    // Check if the target is within the sword's swing angle
                    if (Math.abs(angleDifference) <= (Sword.baseSwingAngle / 2) * (Math.PI / 180)) {
                        targetPlayer.hp -= Sword.baseDamage;

                        // Calculate knockback based on distance and attacker's rotation
                        const maxKnockback = 50; // Maximum knockback value
                        const knockback = maxKnockback * (1 - (distance / (Sword.baseRange + 20)));
                        const knockbackX = Math.cos(attackerPlayer.rotation) * knockback;
                        const knockbackY = Math.sin(attackerPlayer.rotation) * knockback;

                        // Apply knockback to the target
                        targetPlayer.x += knockbackX;
                        targetPlayer.y += knockbackY;
                        targetPlayerSchema.fromPlayer(targetPlayer);

                        console.log("Player", player.sessionId, "hit Player", sessionId, "for", 10, "damage!", "new HP:", targetPlayerSchema.hp);
                        if(targetPlayer.hp <= 0){
                            //this.handlePlayerDeath(targetPlayerSchema);
                        }
                    }
                }
            });
        }
    }

    private distanceBetweenPlayers(player1: Player, player2: Player): number {
        return Math.sqrt(Math.pow(player1.x - player2.x, 2) + Math.pow(player1.y - player2.y, 2));
    }
}