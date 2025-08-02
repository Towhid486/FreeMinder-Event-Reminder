import nodemailer from "nodemailer"

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}

const SendEmailUtility = async (
    EmailTo: string,
    EmailSubject: string,
    EmailText: string
): Promise<any> => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "developertowhid@gmail.com",
            pass: "zgieegvuihtdkjwo"
        },
        tls: { rejectUnauthorized: false }
    });

    let mailOptions: MailOptions = {
        from: 'FreeMinder App <developertowhid@gmail.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return await transporter.sendMail(mailOptions);
}

export default SendEmailUtility;