import {Scene} from "phaser";
import {MyRoomState, PlayerSchema, WallSchema} from "../state/MyRoomState";
import {Arrow} from "../../shared/entities/Arrow";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {TIME_STEP} from "../../client/backend";
import {Wall} from "../../shared/entities/Wall";

export class GameService{
    state: MyRoomState;

    constructor(state: MyRoomState) {
        this.state = state;
    }

    makeProjectileActions(){
        this.state.arrows.forEach((arrowSchema, index) => {
            const arrow = new Arrow(arrowSchema.x, arrowSchema.y, arrowSchema.rotation, arrowSchema.ownerId);
            arrow.update(TIME_STEP / 1000);
            arrowSchema.fromArrow(arrow);

            this.state.players.forEach(playerSchema => {
                const player = PlayerFactory.createPlayer(playerSchema);
                if (arrow.ownerId !== playerSchema.sessionId && arrow.checkCollision(player)) {
                    player.currentHp -= arrow.damage;
                    playerSchema.fromPlayer(player);
                    this.state.arrows.splice(index, 1);
                    console.log("Arrow hit player", playerSchema.sessionId, "for", arrow.damage, "damage!");
                    if(playerSchema.currentHp <= 0){
                        this.handlePlayerDeath(playerSchema);
                    }

                }
            });

        });

    }


    handlePlayerDeath(playerSchema: PlayerSchema) {
        const player = PlayerFactory.createPlayer(playerSchema);
        player.x = Math.random() * this.state.mapWidth;
        player.y = Math.random() * this.state.mapHeight;
        player.currentHp = 100;
        playerSchema.fromPlayer(player);
        console.log("Player", "died and respawned!");
    }
    
    addWall(wall: Wall){

        let wallSchema = new WallSchema();
        wallSchema.fromWall(wall);
        this.state.walls.push(wallSchema);
    }
}