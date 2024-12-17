import { Room, Client } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import {MyRoomState, PlayerSchema} from "../state/MyRoomState";
import {Player} from "../../shared/entities/Player";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {Arrow} from "../../shared/entities/Arrow";
import {GameService} from "../services/GameService";
import {ItemRegistry} from "../services/ItemRegistry";


export class MyRoom extends Room<MyRoomState> {
    fixedTimeStep = 1000 / 60;

    onCreate (options: any) {
        this.setState(new MyRoomState());

        // set map dimensions
        this.state.mapWidth = 2000;
        this.state.mapHeight = 2000;

        this.onMessage(0, (client, input) => {
            // handle player input
            const player = this.state.players.get(client.sessionId);

            // enqueue input to user input buffer.
            player.inputQueue.push(input);
        });


        let elapsedTime = 0;
        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime;

            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep;
                this.fixedTick(this.fixedTimeStep);
            }
        });

    }

    fixedTick(timeStep: number) {

        const gameService = new GameService(this.state);

        this.state.players.forEach(playerSchema => {
            const player = PlayerFactory.createPlayer(playerSchema);
            const playerClicked = player.inputQueue.length > 0 && player.inputQueue[0].mouseClick;

            // run passive items
            player.inventory.getPassiveItems().forEach(item => {
                console.log("running passive item", item.name);
                const itemService = ItemRegistry[item.name]();
                itemService.use(player, gameService);
            });

            player.processInputQueue();

            //if click detected, use item
            if(playerClicked){
                console.log("running special aciton");
                const selectedItem = player.getSelectedItem();
                console.log("selected item cooldown pre:")
                const itemService = ItemRegistry[selectedItem.name]();
                itemService.use(player, gameService);
                this.broadcast("itemUsed", { sessionId: player.sessionId });

            }


            playerSchema.fromPlayer(player);
        });

        this.state.arrows.forEach((arrowSchema, index) => {
            const arrow = new Arrow(arrowSchema.x, arrowSchema.y, arrowSchema.rotation, arrowSchema.ownerId);
            arrow.update(timeStep / 1000);
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

    onJoin (client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        const player = new Player(Math.random() * this.state.mapWidth, Math.random() * this.state.mapHeight);
        player.sessionId = client.sessionId;


        const playerSchema = new PlayerSchema();
        playerSchema.fromPlayer(player);

        this.state.players.set(client.sessionId, playerSchema);
    }

    onLeave (client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

    handlePlayerDeath(playerSchema: PlayerSchema) {
        const player = PlayerFactory.createPlayer(playerSchema);
        player.x = Math.random() * this.state.mapWidth;
        player.y = Math.random() * this.state.mapHeight;
        player.currentHp = 100;
        playerSchema.fromPlayer(player);
        console.log("Player", "died and respawned!");
    }

}