import mongoose from "mongoose";
import { DatabaseConfig } from "../type";
import config from "../config";
import constructMongodbOptions from "../constructMongodbOption";
import logger from "../logger"

interface DbOptions {
    host?: string;
    dbName?: string;
    autoReconnect?: boolean;
    
}

class MongoStoreService {
    url: string;
    dbOptions: DbOptions;
    db: any;
    appStart: boolean;

    constructor(options: DatabaseConfig) {
        const { uri, options: dbOptions } = constructMongodbOptions(options);
        this.url = uri;
        this.dbOptions = dbOptions;
        this.db = null;
        this.appStart = true;
    }

    async dbReady() {
        if (this.db) {
            return this.db;
        }

        const dbConnection = await mongoose.connect(this.url, {
            ...this.dbOptions,
            dbName: config.database.dbName
        });
        try {
            if (dbConnection) {
                logger.info("Successfully connected to mongodb");
                this.db = dbConnection;
                return this.db;
            }
        } catch (err) {
            logger.error("Cannot connect to mongodb", err);
        }
    }
}

export default MongoStoreService;
