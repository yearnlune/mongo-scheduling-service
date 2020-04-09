import Agenda from "agenda";
import * as config from "./config";
import * as mongo from "./mongo";

export enum TimeUnit {
    SECOND = 'seconds',
    MINUTE = 'minutes',
    HOUR = 'hours',
    DAY = 'days',
    WEEK = 'weeks',
    MONTH = 'months',
    YEAR = 'years'
}

export interface ScheduleBase {
    name: string,
    interval: number,
    timeUnit: TimeUnit,
    actionHandler: any
}

let INSTANCE: Schedule;

export class Schedule {
    private _agenda: Agenda;
    private _list: ScheduleBase[];

    constructor() {
        this._agenda = new Agenda({
            db: {
                address: config.getMongoFullURL()
            }
        });
        this._list = [];
        mongo.init();
    }

    private async define(name: string, handler: any) {
        this._agenda.define(name, handler);
    }

    add(scheduleList: ScheduleBase[]) {
        scheduleList.forEach((value) => {
            this._list.push(value);
        })
    }

    async start() {
        for (const value of this._list) {
            await this.define(value.name, value.actionHandler);
        }

        console.log('==== SCHEDULING START ====');

        await new Promise(
            resolve => this._agenda.once('ready', resolve)
        );

        for (const value of this._list) {
            this._agenda.every(this.makeHumanInterval(value.interval, value.timeUnit), value.name).then(() => {
                console.log("SCHEDULE EVERY SUCCESS", value.name);
            }).catch((err) => {
                console.log("EVERY FAILED", err);
            });
        }

        await this._agenda.start();
    }

    makeHumanInterval(interval: number, timeUnit: TimeUnit): string {
        return interval + " " + timeUnit;
    }
}

export function init() {
    INSTANCE = new Schedule();
    return INSTANCE;
}

export function add(scheduleList: ScheduleBase[]) {
    if (!INSTANCE) {
        throw new Error("SCHEDULE INSTANCE NOT FOUND");
    }

    return INSTANCE.add(scheduleList);
}

export async function start() {
    if (!INSTANCE) {
        throw new Error("SCHEDULE INSTANCE NOT FOUND");
    }

    return await INSTANCE.start();
}
