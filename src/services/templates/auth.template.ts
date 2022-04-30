import nunjucks from 'nunjucks';
import path from 'path';
import config from '../../config';

const TEMPLATE_PATH = path.resolve(__dirname, '../../templates');
nunjucks.configure(TEMPLATE_PATH, { autoescape: true });

export const registrationEmailContent = (userDetails: any) =>
  nunjucks.render('registration.html', {
    user: {
      user_name: userDetails.user_name,
      verification_code: userDetails.verification_code
    },
    
  });
