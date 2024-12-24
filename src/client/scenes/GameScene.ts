/**
 * ---------------------------
 * Phaser + Colyseus - Part 1.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update each player's positions WITHOUT interpolation
 */

import Phaser from "phaser";
import {Client, Room} from "colyseus.js";
import {BACKEND_URL} from "../backend";
import {ArrowSchema, PlayerSchema, WallSchema} from "../../server/state/MyRoomState";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {PlayerClient} from "../entities/PlayerClient";
import {ArrowClient} from "../entities/ArrowClient";
import {ArrowFactory} from "../../shared/factories/ArrowFactory";
import {Wall} from "../../shared/entities/Wall";
import {WallClient} from "../entities/WallClient";

export class GameScene extends Phaser.Scene {
    room: Room;

    currentPlayer: PlayerClient;
    playerEntities: { [sessionId: string]: PlayerClient } = {};
    arrowsEntities: { [ownerId: string]: ArrowClient } = {};
    wallsEntities: { [ownerId: string]: WallClient } = {};

    debugFPS: Phaser.GameObjects.Text;

    remoteRef: Phaser.GameObjects.Rectangle;

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
        mouseX: 0,
        mouseY: 0,
        mouseClick: false,
        tick: undefined,
        selectedItemIndex:0
    };

    elapsedTime = 0;
    fixedTimeStep = 1000 / 60;

    currentTick: number = 0;

    constructor() {
        super({ key: "part4" });
    }

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", }).setScrollFactor(0);;


        const graphics = this.add.graphics();

        // Set the color for the walkable area
        graphics.fillStyle(0xacacac, 1); // Green color
        graphics.fillRect(50, 50, 1900, 1900);


        // connect with the room
        await this.connect();


        this.room.state.players.onAdd((playerSchema :PlayerSchema, sessionId) => {

            const player = PlayerFactory.createPlayer(playerSchema);
            const playerClient = new PlayerClient(this, player, this.room.sessionId);
            this.playerEntities[sessionId] = playerClient;

            // is current player
            if (sessionId === this.room.sessionId) {
                this.currentPlayer = playerClient;

                playerSchema.onChange(() => {
                    playerClient.player = PlayerFactory.createPlayer(playerSchema);
                    playerClient.update(this.room.sessionId);
                });

                // Set camera to follow the player
                this.cameras.main.startFollow(this.currentPlayer, true, 0.1, 0.1);
                this.cameras.main.setZoom(1);
                this.cameras.main.setBounds(0, 0, 2000, 2000);


            } else {
                // listening for server updates
                playerSchema.onChange(() => {
                    playerClient.player = PlayerFactory.createPlayer(playerSchema);
                    playerClient.update(this.room.sessionId);
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

        this.room.onMessage("itemUsed", (message) => {
            const playerClient = this.playerEntities[message.sessionId];
            if (playerClient) {
                playerClient.playUseItemAnimation();
            }
        });

        this.room.state.walls.onAdd((wallSchema: WallSchema) =>{
            let wall = new Wall(wallSchema.x, wallSchema.y, wallSchema.hp);

            const wallClient = new WallClient(this, wall);
            console.log("wall added", wallSchema.id);

            this.wallsEntities[wallSchema.id] = wallClient;

            wallSchema.onChange(() => {
                let wall = new Wall(wallSchema.x, wallSchema.y, wallSchema.hp);
                const wallClient = new WallClient(this, wall);

                wallClient.update();
            });
        })

        this.room.state.arrows.onAdd((arrowSchema : ArrowSchema) => {
            const arrow = ArrowFactory.createArrow(arrowSchema);
            const arrowClient = new ArrowClient(this, arrow);
            console.log("arrow added", arrowSchema.id);

            this.arrowsEntities[arrowSchema.id] = arrowClient;

            arrowSchema.onChange(() => {
                arrowClient.arrow = ArrowFactory.createArrow(arrowSchema);
                arrowClient.update();
            });
        });

        this.room.state.arrows.onRemove((arrowSchema: ArrowSchema) => {
            const arrow = this.arrowsEntities[arrowSchema.id];
            console.log(this.arrowsEntities)
            console.log("arrow removed", arrowSchema.id);
            if (arrow) {
                console.log("destroying arrow", arrowSchema.id);
                arrow.destroy();
                console.log(this.arrowsEntities)
                delete this.arrowsEntities[arrowSchema.id];
                console.log(this.arrowsEntities)
            }
        });

        // Handle number key input for selecting inventory items
        this.input.keyboard.on('keydown', (event) => {
            const key = event.key;
            console.log("key pressed", key);
            if (key >= '1' && key <= '9') {
                const index = parseInt(key) - 1;
                this.inputPayload.selectedItemIndex = index;
            }
        });

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
        this.inputPayload.mouseX = this.input.mousePointer.x + this.cameras.main.scrollX;
        this.inputPayload.mouseY = this.input.mousePointer.y + this.cameras.main.scrollY;
        this.inputPayload.mouseClick = this.input.activePointer.isDown;
        this.room.send(0, this.inputPayload);

        this.currentPlayer.player.addInput(this.inputPayload);
        this.currentPlayer.player.processInputQueue();


        if (this.input.activePointer.isDown) {
            this.currentPlayer.playUseItemAnimation();
        }

        for (let sessionId in this.playerEntities) {
            this.playerEntities[sessionId].update(this.room.sessionId);
        }

        for(let arrowId in this.arrowsEntities){
            this.arrowsEntities[arrowId].update();
        }
    }
}