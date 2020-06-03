import { Route } from 'js-express-server'

type RouteListType = Route[];

const routes: RouteListType = [
    {
        path: '/_/healthcheck',
        method: 'get',
        handler: require('nodepress-healthchecker')
    }
];

export default routes;

