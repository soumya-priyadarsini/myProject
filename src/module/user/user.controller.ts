import express from 'express';
import config from '../../config';
import logger from '../../logger';
import { generateRandomCode } from '../../utils/helper';
import QueueService from '../../services/rabbitmq.service';
import UserService from './user.service';

const userService = new UserService(config.database)

const rabbitmqService = new QueueService({
    hostname: config.rabbitmqConfig.host,
    port: config.rabbitmqConfig.port,
    username: config.rabbitmqConfig.username,
    password: config.rabbitmqConfig.password
});

export const register = async(
    req:express.Request | any,
    res:express.Response
) =>{
    const newUser = {
        user_name:req.body.user_name,
        email:req.body.email,
        password:req.body.password,
        verification_code:generateRandomCode()
    }
    userService.create(newUser).then(async(user:any) => {
        // if(user){
        //     return res.status(200).json({
        //         message:"register successfully",
        //         success:true,
        //         user
        //     })
        // }
        await rabbitmqService.assertExchange(config.rabbitmqConfig.exchangeName)
        const isSuccessfulPush = await rabbitmqService.pushToExchange(
            config.rabbitmqConfig.exchangeName,
            'registration',
            { userId: user._id}
        )
        if (isSuccessfulPush) {
            return res.status(200).json({
                message: 'user created',
                user: {
                    user_name: user.user_name,
                    email: user.email,
                }
            })
        } else {
            logger.error('Error in publishing message')
        }

    }) .catch((error: Error) => {
        logger.error("ERROR_IN_CREATING_USER");
        res.status(500).json({
          message: "ERROR_IN_CREATING_USER",
          error: error,
        });
      });
}