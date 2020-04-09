import * as JsExpressServer from 'js-express-server';
import * as config from './config';
import * as schedule from './schedule';
import {ScheduleBase, TimeUnit} from './schedule';

config.init(
    {
        host: process.env.MONGO_HOST || 'mongodb',
        port: parseInt(process.env.MONGO_PORT || '27017'),
        defaultDbName: process.env.MONGO_DB_NAME || 'default'
    },
    {
        apiOriginPath: process.env.ORIGIN_PATH || '/',
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

server.start();
