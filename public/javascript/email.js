const nodemailer = require('nodemailer')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}




function sendEmail(title, receiver, html) {

  if (!title) { title = '沒有主旨' }
  if (!html) { html = '沒有內文' }
  if (!receiver) {
    receiver = process.env.email_user
    html = '收件者信箱出錯'
  }

  //公司host
  // let transporter = nodemailer.createTransport({
  // host: process.env.MAIL_3FQC,
  // port: 25,
  // auth: {
  //   user: process.env.FQC_user,
  //   pass: process.env.FQC_password
  // }
  // });

  // mailOption = {
  // from: process.env.FQC_user,
  // to: `${receiver}`, //收件者
  // subject: `${title}`, // 主旨
  // html: `<div>${html}</div>`// html 內文
  // }

//Gmailhost
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
    to: `${receiver}`, //收件者
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



