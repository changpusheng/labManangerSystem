const nodemailer = require('nodemailer')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}

//公司host
// let transporter = nodemailer.createTransport({
//   host: process.env.MAIL_3FQC,
//   port: 25,
//   auth: {
//     user: process.env.FQC_user,
//     pass: process.env.FQC_password
//   }
// });

// mailOption = {
//   from: process.env.FQC_user,
//   to: 'pusheng@ecic.com.tw', //收件者
//   subject: 'Hey~', // 主旨
//   html: '<b>Test mail </b>' // html 內文
// }


//Gmailhost

function sendEmail(title, html) {

  if (!title) { title = '沒有主旨' }
  if (!html) { html = '沒有內文' }

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
    subject: `${title}`, // 主旨
    html: `<div>${html}</div>` // html 內文
  }


  transporter.sendMail(mailOption, function (error, info) {//寄信方法
    if (error) {
      return console.log(error);
    } else {
      console.log("訊息已發送: " + info.response);
    }
  });

}

module.exports = sendEmail



