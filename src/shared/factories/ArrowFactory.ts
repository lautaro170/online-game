import {ArrowSchema} from "../../server/state/MyRoomState";
import {Arrow} from "../entities/Arrow";

export class ArrowFactory {
    static createArrow(arrowSchema:ArrowSchema) {
        return new Arrow(arrowSchema.x, arrowSchema.y, arrowSchema.rotation, arrowSchema.ownerId);
    }
}