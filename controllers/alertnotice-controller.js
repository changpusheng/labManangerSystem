const axios = require('axios')
const cheerio = require("cheerio")
url = "http://localhost:3000/"

const noticeController = {
  getdata: (req, res, next) => {
    axios.get(url).then(res => {
      let data = res.data
      const $ = cheerio.load(data)
      let toxic = $("#toxic-data")
      let result = []
      for (let i = 0; i < toxic.length; i++) {
        result.push($(toxic[i]).text())
      }
      console.log(result)
    });
    res.render('notice/alert-notice')
  }
}

module.exports = noticeController