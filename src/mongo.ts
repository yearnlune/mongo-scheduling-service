import {MongoClient} from "mongodb";
import * as config from "./config";

let INSTANCE: Mongo;

export class Mongo {
    private _connection: MongoClient | null = null;

    constructor() {
        this.connect();
    }

    private connect() {
        MongoClient.connect(config.getMongoURL(), {
            poolSize: 5,
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, (err, client) => {
            if (err) {
                console.error(err);
            } else {
                this._connection = client;
            }
        });
    }
}

export function init() {
    INSTANCE = new Mongo();
    return INSTANCE;
}
