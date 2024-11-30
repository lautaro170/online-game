/**
 * ---------------------------
 * Phaser + Colyseus - Part 1.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update each player's positions WITHOUT interpolation
 */

import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../backend";
import {PlayerSchema} from "../../server/state/MyRoomState";
import {Player} from "../../shared/entities/Player";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {PlayerClient} from "../entities/PlayerClient";

export class GameScene extends Phaser.Scene {
    room: Room;

    currentPlayer: PlayerClient;
    playerEntities: { [sessionId: string]: PlayerClient } = {};

    debugFPS: Phaser.GameObjects.Text;

    remoteRef: Phaser.GameObjects.Rectangle;

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
        tick: undefined,
    };

    elapsedTime = 0;
    fixedTimeStep = 1000 / 60;

    currentTick: number = 0;

    constructor() {
        super({ key: "part4" });
    }

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", });

        // connect with the room
        await this.connect();

        this.room.state.players.onAdd((playerSchema :PlayerSchema, sessionId) => {

            const player = PlayerFactory.createPlayer(playerSchema);
            const playerClient = new PlayerClient(this, player);
           //const entity = this.physics.add.image(playerSchema.x, playerSchema.y, 'ship_0001');
            this.playerEntities[sessionId] = playerClient;

            // is current player
            if (sessionId === this.room.sessionId) {
                this.currentPlayer = playerClient;

                playerSchema.onChange(() => {
                    playerClient.player = PlayerFactory.createPlayer(playerSchema);;
                    playerClient.update();
                });

            } else {
                // listening for server updates
                playerSchema.onChange(() => {
                    playerClient.player = PlayerFactory.createPlayer(playerSchema);;
                    playerClient.update();
                });
            }
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId];
            if (entity) {
                entity.destroy();
                delete this.playerEntities[sessionId]
            }
        });

        // this.cameras.main.startFollow(this.ship, true, 0.2, 0.2);
        // this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, 800, 600);
    }

    async connect() {
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        const client = new Client(BACKEND_URL);

        try {
            this.room = await client.joinOrCreate("part1_room", {});

            // connection successful!
            connectionStatusText.destroy();

        } catch (e) {
            // couldn't connect
            connectionStatusText.text =  "Could not connect with the server.";
        }

    }

    update(time: number, delta: number): void {
        // skip loop if not connected yet.
        if (!this.currentPlayer) { return; }

        this.elapsedTime += delta;
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep;
            this.fixedTick(time, this.fixedTimeStep);
        }

        this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
    }

    fixedTick(time, delta) {
        this.currentTick++;

        this.inputPayload.left = this.cursorKeys.left.isDown;
        this.inputPayload.right = this.cursorKeys.right.isDown;
        this.inputPayload.up = this.cursorKeys.up.isDown;
        this.inputPayload.down = this.cursorKeys.down.isDown;
        this.inputPayload.tick = this.currentTick;
        this.room.send(0, this.inputPayload);


        this.currentPlayer.player.addInput(this.inputPayload);
        this.currentPlayer.player.processInputQueue();

        if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.space)){
            this.handleSwordSwing();
        }

        this.currentPlayer.update();

        for (let sessionId in this.playerEntities) {
            // interpolate all player entities, but current player
            if (sessionId === this.room.sessionId) {
                continue;
            }
            this.playerEntities[sessionId].update();
        }
    }

    handleSwordSwing() {
        if (!this.currentPlayer) return;
        console.log("trying to swing sword");
        this.currentPlayer.playAttackAnimation();
        console.log("swordSwing");
        this.room.send("swordSwing", {});


    }

}