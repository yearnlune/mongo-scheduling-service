import {Request, Response} from "express";

export default async function (req: Request, res: Response) {
    let healthCheckTest: boolean = Boolean(process.env.HEALTH_CHECK_LOG) || false

    if (healthCheckTest) {
        console.log("HEALTH CHECK");
    }
    res
        .status(200).contentType('application/json')
        .send(JSON.stringify({status: "UP"}));
}
