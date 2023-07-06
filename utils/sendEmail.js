import nodemailer from 'nodemailer';
import { emailConfig } from '../config/emailConfig.js';

// create reusable transporter object using the default SMTP transport
const transport=nodemailer.createTransport(emailConfig);

// send mail with defined transport object

export const sendEmails=(to,subject,content,next)=>{
try {
    const message={
        from:{
          name:process.env.MAIL_FROM_NAME,
          address:process.env.MAIL_USERNAME
        },
        to:to,
        subject:subject,
        html:content
    };
    transport.sendMail(message,next)
} catch (error) {
    console.log(error.message);
}
}