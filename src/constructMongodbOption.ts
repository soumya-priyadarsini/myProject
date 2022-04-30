declare namespace MongodbOptions {
    interface DbOptions {
        host?: string;
        dbName?: string;
        replicaSet?: string;
        autoReconnect?: boolean;
        sslPath?: string;
    }

    interface ConnectionStringOptions {
        replicaSet?: string;
        ssl?: string;
    }
}

const constructMongodbOption = (
    dbOptions: Partial<MongodbOptions.DbOptions>
) => {
    const options ={}
    const {  host = 'localhost', dbName = 'test' } = dbOptions;
    const connectionStringOptions: Partial<MongodbOptions.ConnectionStringOptions> = {};

    if (dbOptions.replicaSet) {
        connectionStringOptions.replicaSet = dbOptions.replicaSet;
    }

    if (dbOptions.sslPath) {
        connectionStringOptions.ssl = 'true';
    }

    const uri = `mongodb://${host}`;

    return {
        uri,
        options
    };
};

export default constructMongodbOption;
