import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    }
});

function sendMail(message) {
    return transport.sendMail(message);
}

export default {sendMail};