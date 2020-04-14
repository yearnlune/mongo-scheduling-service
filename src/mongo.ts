import {MongoClient} from "mongodb";
import * as config from "./config";

let INSTANCE: Mongo;

export class Mongo {
    private _connection: MongoClient | null = null;

    constructor() {
        this.connect();
    }

    connect() {
        MongoClient.connect(config.getMongoURL(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 5
        }, (err, client) => {
            if (err) {
                console.error(err);
            } else {
                this._connection = client;
            }
        });
    }

    get connection(): MongoClient | null {
        return this._connection;
    }
}

export function init() {
    INSTANCE = new Mongo();
    return INSTANCE;
}

export function getConnection(): MongoClient | null {
    if (!INSTANCE.connection?.isConnected()) {
        console.log("FOUND NOT MONGO CONNECT");
    }
    return INSTANCE.connection;
}
