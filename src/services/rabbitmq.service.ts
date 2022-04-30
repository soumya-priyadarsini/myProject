import amqp from 'amqplib';
import logger from '../logger'

interface IConnectionString {
    hostname: string;
    port: any;
    username: string;
    password: string;
}

const doTimeout = (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000));

const createConnection = async (options: IConnectionString) => {
    const { hostname, port, username, password } = options;
    const connection = await amqp.connect({
        protocol: 'amqp',
        hostname,
        port,
        username,
        password
    })
    // const connection = await amqp.connect(`amqps://${username}:${password}@${hostname}/${username}`)
    connection.on('error', () => { })
    return connection;
}

const createChannel = (connection: amqp.Connection) => connection.createChannel();

class QueueService {
    queueConnection: any;
    queueChannels: any;
    rabbitmqConfig: any;
    connectionChannel: any;

    constructor(config: IConnectionString) {
        this.queueConnection = null;
        this.queueChannels = {};
        this.rabbitmqConfig = config;
        this.connectionChannel = null;
    }

    async consumeFromQueue(queueName: any, callback: any) { // eslint-disable-line
        try {
            return await this.connectionChannel.consume(
                queueName,
                callback,
                { noAck: true },
            );
        } catch (exception) {
            logger.error(exception);
            return false;
        }
    };

    async assertExchange(exchangeName: string) {
        try {
            if (!this.queueConnection) {
                this.queueConnection = await createConnection(this.rabbitmqConfig);
            }
            if (!this.connectionChannel) {
                this.connectionChannel = await createChannel(this.queueConnection);
            }
            await this.connectionChannel.assertExchange(exchangeName, 'topic', { durable: true });
        } catch (e) {
            const errorMessage = `Exchange ${exchangeName} connection/channel/asserts error`;
            this.queueConnection = null;
            this.connectionChannel = null;

            logger.error(errorMessage, e);
            throw new Error(errorMessage);
        }
    }

    async pushToExchange(exchangeName: string, routingKey: string, msg: any) {
        const TIMEOUT_SECONDS = 1;
        const MAX_QUEUE_RETRIES = 3;
        let queueRetryCount = 0;

        while (queueRetryCount < MAX_QUEUE_RETRIES) {
            try {
                const publishOptions = {
                    persistent: true,
                    expiration: 30 * 60 * 1000, // 3o minutes
                };
                logger.info(`Pushing to exchange ${exchangeName} with key ${routingKey}`)
                const messageBuffer = Buffer.from(JSON.stringify(msg));
                await this.connectionChannel.publish(
                    exchangeName,
                    routingKey,
                    messageBuffer,
                    publishOptions
                );
                return true;
            } catch (e) {
                console.log('Error', e)
                if (queueRetryCount < MAX_QUEUE_RETRIES) {
                    queueRetryCount += 1;
                    logger.error(`[pushToExchange] Posting to message to exchange failed, retrying (${queueRetryCount}): ${msg}`);
                    await doTimeout(TIMEOUT_SECONDS);
                } else {
                    return false;
                }
            }
        }

        return true;
    }
    async bindQueue(exchangeName: string, queueName: string, routingKey: string) {
        try {
          if (!this.queueConnection) {
            this.queueConnection = await createConnection(this.rabbitmqConfig);
          }
          if (!this.connectionChannel) {
            this.connectionChannel = await createChannel(this.queueConnection);
          }
          await this.connectionChannel.bindQueue(queueName, exchangeName, routingKey);
        } catch (e) {
          const errorMessage = `Error in binding queue ${queueName} to Exchange ${exchangeName}`;
          this.queueConnection = null;
          this.connectionChannel = null;
          logger.error(errorMessage, e);
          throw new Error(errorMessage);
        }
      }
    

}

export default QueueService;