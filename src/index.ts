import express from 'express';
import routes from './routes';
import config from './config';
import logger from './logger';

import MongoStoreService from './services/mongo.service';
import initMessageQueueListeners from './message_queue.listener';

const app: express.Express = express();


(async () => {
    const mongoStoreService = new MongoStoreService(config.database);
    await mongoStoreService.dbReady();
})();
app.use(express.json());
app.use('/v1', routes)

app.listen(config.serverPort,
    async (): Promise<void> => {
        logger.info(`Project Started on port ${config.serverPort}`);
       await initMessageQueueListeners();
    })

            