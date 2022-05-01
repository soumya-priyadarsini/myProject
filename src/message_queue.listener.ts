import config from './config';
import logger from './logger';

import QueueService from './services/rabbitmq.service';
import * as AuthActions from './module/user/user.action';


interface IKey {
  [key: string]: string;
}

const getKey: IKey = {
  registra: 'registra',
  
};

const handleQueue = async (queueName: any, msg: any) => {
  switch (queueName) {
    case 'registra':
      AuthActions.registration(msg);
      break;
    
    default:
      logger.info(`Worker does not handle queue: ${queueName}`);
  }
};

const initMessageQueueListeners = async (): Promise<void> => {
  try {
    const queueService = new QueueService({
      hostname: config.rabbitmqConfig.host,
      port: config.rabbitmqConfig.port,
      username: config.rabbitmqConfig.username,
      password: config.rabbitmqConfig.password
    });
    // assert exchange
    await queueService.assertExchange(config.rabbitmqConfig.exchangeName);
    const queueList = config.rabbitmqConfig.queues;
    logger.info(`initialized MessageQueueListeners`);
    queueList.map(async (queueName) => {
      // Step 1: assert queues
      await queueService.assertQueue(queueName);
      // Step 2: bind queues to exchange
      await queueService.bindQueue(config.rabbitmqConfig.exchangeName, queueName, getKey[queueName]);
      // Step 3: Listen to queues
      await queueService.consumeFromQueue(queueName, (rawMessage: any) => {
        handleQueue(queueName, rawMessage.content.toString());
      });
    });
    logger.info(`Listening on exchange ${config.rabbitmqConfig.exchangeName}`);
  } catch (e) {
    logger.error(`Error in initMessageQueueListeners ${e}`);
    throw e;
  }
};

export default initMessageQueueListeners;
