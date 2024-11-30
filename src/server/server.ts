import { Server } from "colyseus";
import { createServer } from "http";
import { MyRoom } from "./rooms/MyRoom";

const app = require("express")();
const gameServer = new Server({
    server: createServer(app),
});

gameServer.define("part1_room", MyRoom);
//gameServer.simulateLatency(200);

gameServer.listen(2567).then(r => {
    console.log("Server is listening on ws://localhost:2567");
});
