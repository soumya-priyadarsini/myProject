import MongoStoreService from '../../services/mongo.service';
import { DatabaseConfig } from '../../type';
import logger from '../../logger';
import { User } from './user.model';


const UserProjection = `user_name email password` 

class UserService extends MongoStoreService {
    dbConnection: any;

    constructor(options: DatabaseConfig) {
        super(options);
    }

    async init(): Promise<boolean> {
        this.dbConnection = await super.dbReady();
        if (this.dbConnection) {
            return true;
        }
        return false;
    }

    async create(user:any){
        try{
            logger.info('creating user')
            return await new User(user).save()
        }catch(error){
            throw new Error(`Error getting user from collection ${error}`)
        }
    }

    async findUserById(userId: any) {
        try {
            logger.info(`finding user ${userId}`)
            return await User
                .findById(userId)
                .select(UserProjection)
                .exec()
        } catch (error) {
            logger.error(`Error in finding user ${error}`)
            throw new Error(`Error getting user from collection ${error}`)
        }
    }
}
export default UserService
