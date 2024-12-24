import { Room, Client } from "colyseus";
import {MyRoomState, PlayerSchema} from "../state/MyRoomState";
import {Player} from "../../shared/entities/Player";
import {PlayerFactory} from "../../shared/factories/PlayerFactory";
import {GameService} from "../services/GameService";
import {ItemRegistry} from "../services/ItemRegistry";
import {TIME_STEP} from "../../client/backend";


export class MyRoom extends Room<MyRoomState> {

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

            while (elapsedTime >= TIME_STEP) {
                elapsedTime -= TIME_STEP;
                this.fixedTick(TIME_STEP);
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

            gameService.makeProjectileActions();


            playerSchema.fromPlayer(player);
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
}