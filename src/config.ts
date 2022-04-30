import 'dotenv/config';
import { DatabaseConfig,RabbiqMQConfig , SmtpConfig} from './type';

interface ApiKeyConfig{
    serverPort:number,
    database:DatabaseConfig,
    rabbitmqConfig: RabbiqMQConfig,
    smtpConfig: SmtpConfig;
}
const config:ApiKeyConfig = {
    serverPort:Number(process.env.SERVER_PORT) || 3000,
    database:{
        dbType: process.env.DB_TYPE || 'mongodb',
        dbPort: process.env.DB_PORT || 27017,
        host: process.env.DB_HOST || 'localhost:27017',
        dbName: process.env.DB_NAME || 'my_pr',
    },
    smtpConfig: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        username: process.env.SMTP_USERNAME || 'wikianceportal@gmail.com',
        password: process.env.SMTP_PASSWORD || 'fvdsioirpftcessi',
        senderEmail: process.env.SENDER_EMAIL || 'wikianceportal@gmail.com'
      },
    rabbitmqConfig: {
        host: process.env.RABBITMQ_HOST || 'localhost',
        port: Number(process.env.RABBITMQ_PORT) || 5672,
        username: process.env.RABBITMQ_USERNAME || 'guest',
        password: process.env.RABBITMQ_PASSWORD || 'guest',
        queues: [
            'registration'
        ],
        exchangeName: 'ownpr'
    }
}
export default config;