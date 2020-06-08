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

export interface ServerConfig {
    host: string,
    port: number,
    backlog: number,
    callback?: (...args: any[]) => void
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

export function getServerConfig(): ServerConfig {
    return INSTANCE.serverConfig;
}

export function getMongoConfig(): MongoConfig {
    return INSTANCE.mongoConfig;
}

export function getMongoURL(): string {
    return INSTANCE.mongoConfig.url || INSTANCE.getMongoUrl();
}

export function getMongoFullURL(): string {
    return INSTANCE.getMongoUrl() + '/' + INSTANCE.mongoConfig.defaultDbName;
}
