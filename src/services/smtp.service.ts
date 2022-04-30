import nodemailer from 'nodemailer';
import config from '../config';

interface IEmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string
}

export function sendMail(options: IEmailOptions) {
    const { host, port, username, password } = config.smtpConfig;
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user: username,
            pass: password
        }
        // tls: {
        //     // do not fail on invalid certs
        //     rejectUnauthorized: false
        //   }
    });
    return transporter.sendMail(options);
}