const nodemailer = require('nodemailer')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.email_user,
    pass: process.env.email_password
  }
});


mailOption = {
  from: process.env.email_user,
  to: 'sdf753741789@gmail.com', //收件者
  subject: 'Hey~', // 主旨
  html: '<b>Test mail </b>' // html 內文
}

transporter.sendMail(mailOption, function (error, info) {//寄信方法
  if (error) {
    return console.log(error);
  } else {
    console.log("訊息已發送: " + info.response);
  }
});


// var nodemailer = require('nodemailer');

// // Create the transporter with the required configuration for Outlook
// // change the user and pass !
// var transporter = nodemailer.createTransport({
//   host: "smtp-mail.outlook.com", // hostname
//   secureConnection: false, // TLS requires secureConnection to be false
//   port: 587, // port for secure SMTP
//   tls: {
//     ciphers: 'SSLv3'
//   },
//   auth: {
//     user: 'mymail@outlook.com',
//     pass: 'myPassword'
//   }
// });

// // setup e-mail data, even with unicode symbols
// var mailOptions = {
//   from: '"Our Code World " <mymail@outlook.com>', // sender address (who sends)
//   to: 'mymail@mail.com, mymail2@mail.com', // list of receivers (who receives)
//   subject: 'Hello ', // Subject line
//   text: 'Hello world ', // plaintext body
//   html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     return console.log(error);
//   }

//   console.log('Message sent: ' + info.response);
// });