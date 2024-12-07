//create itemRegistry. It receives an item string, and returns a service associated with the name
//For example, receives bow, returns an instance of BowService.
//it is not a class

import {SwordService} from "./SwordService";
import {BowService} from "./BowService";

export const ItemRegistry = {
    "Bow": () => new BowService(),
    "Sword": () => new SwordService()

}