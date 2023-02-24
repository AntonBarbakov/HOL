const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const date = new Date().toJSON();
const emailRecipient = 'vladyslav.senchenkov@codeit.pro, volodymyr.kravchenko@codeit.pro, tetiana.ilchenko@codeit.pro, anton.selin@codeit.pro, yuliia.kotenko@codeit.pro, yulia.velichko@codeit.pro, olga.dereviankina@codeit.pro, anton.barbakov@codeit.pro';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
});
  
let attachments = [];

// Add the HTML report to the attachments
attachments.push({
    filename: `Report_[${date}].html`,
    path: 'C:/projects/hol-automation/cypress/reports/html/index.html'
});

let mailOptions = {
    from: '"TEST AUTOMATION DEPARTMENT" <anton.barbakov@codeit.pro>',
    to: emailRecipient,
    subject: `Test run Report [${date}]`,
    text: 'Please find the attached HTML report. Before you open this file you MUST download it',
    attachments: attachments
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});