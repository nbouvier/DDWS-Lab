import mailer from 'nodemailer'

export function sendMail(to, subject, text) {
    let mlr = mailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: to,
        subject: subject,
        text: text
    };

    mlr.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        }
    });
}

const mail = { sendMail }

export default mail
