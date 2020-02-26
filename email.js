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

async function sendTimeChangeEmail(emails, oldStart, oldEnd, newStart, newEnd, eventName, eventID, registrantID) {
  const link = `http://localhost:3000/editRegistration/${eventID}/${registrantID}`;
  const oldTime = oldStart.toString() + " to " + oldEnd.toString();
  const newTime = newStart.toString() + " to " + newEnd.toString();
  for(var i = 0; i < emails.length; i++){
    try {
      let info = await transporter.sendMail({
        from: '"LICCB Mailer 🚣" <liccb.mailer@gmail.com>', // sender address
        to: emails[i], // list of receivers
        subject: "Time Change", // Subject line
        html: eval('`'+ config.email.body.timeChange +'`')
      });
    console.log(`Successfully sent time changed email to ${emails[i]}`);
    } catch(e) {
      console.log(`Failed to send email to ${emails[i]}`);
    }
  }
}

module.exports.sendConfirmationEmail = sendConfirmationEmail;
module.exports.sendEditRegistrationEmail = sendEditRegistrationEmail;
module.exports.sendTimeChangeEmail = sendTimeChangeEmail;