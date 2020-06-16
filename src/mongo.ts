import {Db, MongoClient} from "mongodb";
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

    getSafeConnection(handler: (db: Db) => any, dbName?: string): Promise<void> {
        const mongoConfig = config.getMongoConfig();
        if (!dbName) {
            dbName = mongoConfig.defaultDbName;
        }

        return new Promise<void>(async (resolve, reject) => {
            if (this._connection?.isConnected()) {
                const db = this._connection.db(dbName);
                Promise.resolve(handler(db))
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            } else {
                this._connection?.connect()
                    .then((mongoClient) => {
                        const db = mongoClient.db(dbName);
                        Promise.resolve(handler(db))
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                reject(err);
                            })
                    })
                    .catch(reject);
            }
        });
    }
}

export function init() {
    INSTANCE = new Mongo();
    return INSTANCE;
}

export function getConnection(): MongoClient | null {
    if (!INSTANCE) {
        throw new Error("MONGO INSTANCE NOT FOUND");
    }

    if (!INSTANCE.connection?.isConnected()) {
        console.log("FOUND NOT MONGO CONNECT");
    }

    return INSTANCE.connection;
}

export function getSafeConnection(handler: (db: Db) => any): Promise<void> {
    if (!INSTANCE) {
        throw new Error("MONGO INSTANCE NOT FOUND");
    }

    return INSTANCE.getSafeConnection(handler);
}
