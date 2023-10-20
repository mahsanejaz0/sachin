const nodemailer = require('nodemailer');
// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'mytether.co',
    port: 465,
    secure: true,
    auth: {
      user: 'mails@mytether.co',
      pass: 'Ahsan@123',
    },
  });

  module.exports = transporter