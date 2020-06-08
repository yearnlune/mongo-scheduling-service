import * as express from "express";

const router = express.Router();

router.get('/_/health',
    require('nodepress-healthchecker'));

export default router;
