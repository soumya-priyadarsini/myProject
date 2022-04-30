import config from '../../config';
import logger from '../../logger';

import * as EmailService from '../../services/smtp.service'
import * as AuthTemplateService from '../../services/templates/auth.template';

import UserService from './user.service';

const userService = new UserService(config.database)

export const registration = async (message: any) => {
    const { userId } = JSON.parse(message);
    try {
      const user: any = await userService.findUserById(userId); 
      console.log(user)
      logger.info(`Sending email to ${user.email}`);
      const emailOptions = {
        from: config.smtpConfig.senderEmail,
        to: user.email,
        subject: 'Techiio || Thanks for the registration!!',
        html: AuthTemplateService.registrationEmailContent(user)
      };
      const sendEmail = await EmailService.sendMail(emailOptions);
      if (sendEmail) {
        logger.info(`Email sent for user ${user.email}`);
      }
    } catch (err) {
      console.log('Error', err);
    }
  };