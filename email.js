"use strict";
const nodemailer = require("nodemailer");
const config = require('./config.json');
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.password 
    }
});

async function sendConfirmationEmail(email, eventID, registrantID) {
  const link = `http://localhost:3000/confirmEmail/${eventID}/${registrantID}`;
  let info = await transporter.sendMail({
    from: '"LICCB Mailer 🚣" <liccb.mailer@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Email Confirmation", // Subject line
    html: eval('`'+ config.email.body +'`')
  });
  console.log(`Successfully sent email confirmation to ${email}`);
}

sendConfirmationEmail("jhandwer@stevens.edu, cbarnwel@stevens.edu, kmorel1339@gmail.com, cjlando3297@gmail.com, senholmes.21@gmail.com, ankdave97@gmail.com", 666, 666);
