import {Settings} from "js-express-server/dist/server";

interface ConfigBase {
    serverConfig: ServerConfig,
    mongoConfig: MongoConfig
}

export interface MongoConfig {
    host: string;
    port: number;
    defaultDbName: string;
    url?: string;
}

export interface ServerConfig extends Settings {
}

let INSTANCE: Config;

class Config implements ConfigBase {
    private _mongoConfig: MongoConfig;
    private _serverConfig: ServerConfig;

    constructor(mongoConfig: MongoConfig, serverConfig: ServerConfig) {
        this._mongoConfig = mongoConfig;
        this._serverConfig = serverConfig;
    }

    get mongoConfig(): MongoConfig {
        return this._mongoConfig;
    }

    get serverConfig(): ServerConfig {
        return this._serverConfig;
    }

    getMongoUrl(): string {
        return this._mongoConfig.url || "mongodb://" + this._mongoConfig.host + ":" + this._mongoConfig.port
    }
}

export function init(mongoConfig: MongoConfig, serverConfig: ServerConfig) {
    INSTANCE = new Config(mongoConfig, serverConfig);
    return INSTANCE;
}

export function getServerConfig() {
    return INSTANCE.serverConfig;
}

export function getMongoConfig() {
    return INSTANCE.mongoConfig;
}

export function getMongoURL() {
    return INSTANCE.mongoConfig.url || INSTANCE.getMongoUrl();
}

export function getMongoFullURL() {
    return INSTANCE.getMongoUrl() + '/' + INSTANCE.mongoConfig.defaultDbName;
}
