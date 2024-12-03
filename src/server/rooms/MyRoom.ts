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
            const attackerPlayerSchema = this.state.players.get(client.sessionId);
            if (!attackerPlayerSchema) return;

            const attackerPlayer = PlayerFactory.createPlayer(attackerPlayerSchema);
            if (attackerPlayer.swingSword()) {
                this.state.players.forEach((targetPlayerSchema, sessionId) => {
                    if (sessionId === client.sessionId) return;

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

                            console.log("Player", client.sessionId, "hit Player", sessionId, "for", 10, "damage!", "new HP:", targetPlayerSchema.hp);
                            if(targetPlayer.hp <= 0){
                                this.handlePlayerDeath(targetPlayerSchema);
                            }
                        }
                    }
                });
            }
            this.broadcast("swordSwing", { sessionId: client.sessionId });
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

    handlePlayerDeath(playerSchema: PlayerSchema) {
        const player = PlayerFactory.createPlayer(playerSchema);
        player.x = Math.random() * this.state.mapWidth;
        player.y = Math.random() * this.state.mapHeight;
        player.hp = 100;
        playerSchema.fromPlayer(player);
        console.log("Player", "died and respawned!");
    }

}