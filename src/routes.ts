import express from 'express';
import * as UserController from './module/user/user.controller'

const expressHealthCheck = require('express-healthcheck');

const router: express.Router = express.Router();

router.get('/up', expressHealthCheck())

router.post('/register',UserController.register)

export default router;