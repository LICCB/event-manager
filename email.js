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
    html: eval('`'+ config.email.body.emailConfirmation +'`')
  });
  console.log(`Successfully sent email confirmation to ${email}`);
}

async function sendEditRegistrationEmail(email, eventName, eventID, registrantID) {
  const link = `http://localhost:3000/editRegistration/${eventID}/${registrantID}`;
  let info = await transporter.sendMail({
    from: '"LICCB Mailer 🚣" <liccb.mailer@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Edit Registration", // Subject line
    html: eval('`'+ config.email.body.editRegistration +'`')
  });
  console.log(`Successfully sent edit registration email to ${email}`);
}

module.exports.sendConfirmationEmail = sendConfirmationEmail;
module.exports.sendEditRegistrationEmail = sendEditRegistrationEmail;
// sendConfirmationEmail("jhandwer@stevens.edu", 666, 666);
