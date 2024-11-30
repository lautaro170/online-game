import { Room, Client } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import {InputData, MyRoomState, PlayerSchema} from "../state/MyRoomState";
import {Player} from "../../shared/entities/Player";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {Sword} from "../../shared/entities/Sword";
import {setItem} from "colyseus.js/lib/Storage";

class State extends Schema {
}

export class MyRoom extends Room<MyRoomState> {
    fixedTimeStep = 1000 / 60;

    onCreate (options: any) {
        this.setState(new MyRoomState());

        // set map dimensions
        this.state.mapWidth = 800;
        this.state.mapHeight = 600;

        this.onMessage(0, (client, input) => {
            // handle player input
            const player = this.state.players.get(client.sessionId);

            // enqueue input to user input buffer.
            player.inputQueue.push(input);
        });

        this.onMessage("swordSwing", (client, message) => {
            console.log("starting swordSwing server")
            const player = this.state.players.get(client.sessionId);
            if (!player) return;

            const playerEntity = PlayerFactory.createPlayer(player);
            if (playerEntity.swingSword()) {
                this.state.players.forEach((target, sessionId) => {
                    if (sessionId === client.sessionId) return;

                    const targetEntity = PlayerFactory.createPlayer(target);
                    const distance = this.distanceBetweenPlayers(playerEntity, targetEntity);
                    console.log("distance", distance);
                    if (distance <= 15/*range*/ ) {
                        target.hp -= 10;//damage
                        target.fromPlayer(targetEntity);
                        console.log("Player", client.sessionId, "hit Player", sessionId, "for", 10, "damage!", "new HP:", target.hp);
                    }
                });
            }
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

        this.state.players.forEach(playerSchema => {

            const player = PlayerFactory.createPlayer(playerSchema);
            player.processInputQueue();
            playerSchema.fromPlayer(player);
        });
    }

    onJoin (client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        const player = new Player(Math.random() * this.state.mapWidth, Math.random() * this.state.mapHeight);
        player.addItem(new Sword());


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

    distanceBetweenPlayers(player1: Player, player2: Player): number {
        return Math.sqrt(Math.pow(player1.x - player2.x, 2) + Math.pow(player1.y - player2.y, 2));
    }
}