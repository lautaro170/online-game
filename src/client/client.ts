import Phaser from "phaser";
import { Client } from "colyseus.js";
import {GameScene} from "./scenes/GameScene";

const client = new Client("ws://localhost:2567");

client.joinOrCreate("part1_room").then(room => {
    console.log("joined successfully", room);
}).catch(e => {
    console.error("join error", e);
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade"
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'gameCanvas'
    },
    scene:[GameScene]
};

const game = new Phaser.Game(config);