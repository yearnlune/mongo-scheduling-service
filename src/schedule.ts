import Agenda from "agenda";
import * as config from "./config";

export class Schedule {
    private _agenda: Agenda = new Agenda({
        db: {address: config.getMongoFullURL()}
    });

    constructor() {
        console.log("INIT SCHEDULE");

    }
}
