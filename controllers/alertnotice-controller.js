const axios = require('axios')
const cheerio = require("cheerio")
const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
const currentDate = dayjs().format('YYYY/MM/DD')
const Ipqc = require('../models/ipqc')

function layout(res, startDate, endDate, sampleName) {
  function randomNumber() {
    const randomNumber = Math.floor(Math.random() * 9)
    return randomNumber
  }
  let data = res.data
  const $ = cheerio.load(data)
  const tableNumber = $("body table")
  let table
  if (tableNumber.length === 1) {
    table = $("body table tbody tr")
  } else {
    table = $("body table tbody tr td table tbody tr")
  }
 
  const arr = []
  for (let i = 1; i < table.length; i++) {
    const obj = {}
    for (let j = 0; j < table.eq(0).find('td').length; j++) {
      obj[`id`] = `a${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`
      obj[`sampleName`] = sampleName
      obj[`終點判定`]="PASS"
      const title = table.eq(0).find('td').eq(j).text().trim()
      obj[`${title}`] = table.eq(i).find('td').eq(j).text().trim()
    }
    arr.push(obj)
  }
  const timeFilter = arr.filter(arr => {
    const date = arr[`${table.eq(0).find('td').eq(0).text().trim()}`]
    if (date === startDate || date === endDate || dayjs(`${date}`).isBetween(`${startDate}`, dayjs(`${endDate}`), 'day')) {
      return true
    }
    else {
      return false
    }
  })
  return timeFilter
}

const noticeController = {
  getdata: (req, res, next) => {
    Ipqc.find().lean().then(async ipqc => {
      const { startDate, endDate,operator} = req.query
      if(!startDate || !endDate) {
        return res.render('notice/alert-notice')
      }
      const start = dayjs(startDate).format('YYYY/MM/DD')
      const end = dayjs(endDate).format('YYYY/MM/DD')
      const ipqcUrlArr = ipqc.map(obj => obj.url)
      const ipqcSampleName = ipqc.map(obj => obj.name)
      // const finalArr = []
      // const layOutArr = []
      let onlineSampleArr =[]
      for (let i = 0; i < ipqcUrlArr.length; i++) {
        const p1 = await axios.get(ipqcUrlArr[i]).catch(() => next('err'))
        const sampleName = ipqcSampleName[i]
        let obj = layout(p1, start, end, sampleName)
        if (obj[0]) {
          obj.map(item => onlineSampleArr.push(item))
          for (let j = 1; j < 9; j++) {
            const getName = ipqc[i][`itemName${j}`]
            if (getName) {
              const result = obj.filter(item => {
                const itemVal = item[`${getName}`]
                const bigVal = ipqc[i][`bigNumber${j}`]
                const smallVal = ipqc[i][`smallNumber${j}`]
                if (Number(itemVal) > Number(bigVal) || Number(itemVal) < Number(smallVal)) {
                  item[`終點判定`] ='FAIL'
                  return true
                } else {
                  return false
                }
              })
              // if (result[0]) {
              //   layOutArr.push(result)
              // }
            }
          }
        }
      }
      //找出異常批號
      // for (let i = 0; i < layOutArr.length; i++) {
      //   for (let j = 0; j < layOutArr[i].length; j++) {
      //     finalArr.push(layOutArr[i][j])
      //   }
      // }
      // const removeRepetItem = finalArr.filter((e, pos) => {
      //   return finalArr.indexOf(e) === pos
      // })

      let filteEndPointItme =[]
      for(let i=0;i<onlineSampleArr.length-1;i++){
        if(!onlineSampleArr[i]) return
        if(onlineSampleArr[i].sampleName === onlineSampleArr[i+1].sampleName && 
        Number(onlineSampleArr[i].批號.slice(0,4)) !== Number(onlineSampleArr[i+1].批號.slice(0,4))){
            if(onlineSampleArr[i].終點判定 === "FAIL"){
              filteEndPointItme.push(onlineSampleArr[i])
            }
          }else if(onlineSampleArr[i].sampleName !== onlineSampleArr[i+1].sampleName){
            if(onlineSampleArr[i].終點判定 === "FAIL"){
              filteEndPointItme.push(onlineSampleArr[i])
            }
          }
      }
      if(operator){
        onlineSampleArr = onlineSampleArr.filter(item =>{
          return item.檢驗者 === operator || item.檢測員 === operator
        })
        filteEndPointItme = filteEndPointItme.filter(item =>{
          return item.檢驗者 === operator || item.檢測員 === operator
        })
      }

      return res.render('notice/alert-notice', { obj:filteEndPointItme, startDate, endDate,onlineSampleArr })
    })
  }
}



module.exports = noticeController