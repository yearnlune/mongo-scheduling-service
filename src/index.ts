import express from 'express';
import * as config from './config';
import * as schedule from './schedule';
import {ScheduleBase, TimeUnit} from './schedule';
import * as mongo from './mongo';
import {AggregationCursor, Db} from "mongodb";
import routes from './routes'
import * as healthChecker from "nodepress-healthchecker";

config.init(
    {
        host: process.env.MONGO_HOST || 'localhost',
        port: parseInt(process.env.MONGO_PORT || '27017'),
        defaultDbName: process.env.MONGO_DB_NAME || 'default'
    },
    {
        host: process.env.HOST || '127.0.0.1',
        port: parseInt(process.env.PORT || '8080'),
        backlog: parseInt(process.env.BACKLOG || '128')
    });

/* SCHEDULE INITIALIZATION */
schedule.init();

/* SCHEDULE DEFINE */
let testSchedule: ScheduleBase = {
    name: 'test',
    interval: 1,
    timeUnit: TimeUnit.DAY,
    actionHandler: async () => {
        console.log("= DEFINE DEMO =");

        await mongo.getSafeConnection(async (db: Db) => {
            const collection = db.collection('notifications');
            const pipeline: any[] = [];

            pipeline.push({
                $match: {
                    target_type: "user"
                }
            });

            const cursor: AggregationCursor<any> = collection.aggregate<any>(pipeline);

            let doc;
            while (doc = await cursor.next()) {
                const item = doc as any;
                console.log(item);
            }
        });

    }
};

schedule.add([testSchedule]);

schedule.start().then(() => {
    console.log('SCHEDULE START');
}).catch((err) => {
    console.error('SCHEDULE START ERROR', err);
});

/* EXPRESS SERVER INITIALIZATION */
const app = express();

/* ADD ROUTES */
app.use('/', routes);

app.listen(
    config.getServerConfig().port,
    config.getServerConfig().host,
    config.getServerConfig().backlog
);

/* HEALTH CHECK */
healthChecker.init([
    {
        category: "mongo", healthCheckHandler: () => {
            return new Promise((resolve, reject) => {
                mongo.getSafeConnection(async db => {
                    try {
                        await db.command({ping: 1});
                        resolve();
                    } catch (e) {
                        console.log(e);
                        reject();
                    }
                }).catch(e => {
                    console.error("DB NOT CONNECTED");
                    reject(e);
                });;
            })
        }
    }
]);
