import * as JsExpressServer from 'js-express-server';
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
        apiOriginPath: process.env.ORIGIN_PATH || '',
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
const server = JsExpressServer.createServer(config.getServerConfig());

/* ADD ROUTES */
server.applyRoutes(routes);

/* HEALTH CHECK */
healthChecker.init([
    {
        category: "mongo", checkHealthHandler: () => {
            return new Promise((resolve, reject) => {
                mongo.getSafeConnection(async db => {
                    try {
                        await db.command({ping: 1});
                        resolve();
                    } catch (e) {
                        console.log(e);
                        reject();
                    }
                });
            })
        }
    }
]);

server.start();
