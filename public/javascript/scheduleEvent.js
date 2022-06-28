const Check = require('../../models/check')
const Item = require('../../models/item')
const dayjs = require('dayjs')


const scheduleEvent = {
  checkSchedule: () => {
    Check.find().lean().then(obj => {
      const currDate = dayjs().format('YYYY/MM/DD')
      const dateFilter = obj.filter(items => {
        const sampleDate = dayjs(items.nextTime).format('YYYY/MM/DD')
        //當前日期等於下次盤點日期或是兩者相差14天amountCheck = false 系統撈出需要盤點的項目
        return dayjs(items.nextTime).format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD') ||
          dayjs(currDate).date() - dayjs(sampleDate).date() > 14
      })
      //資料保存一年
      const lastYear = obj.filter(items => {
        const sampleDate = dayjs(items.nextTime).format('YYYY/MM/DD')
        const year = dayjs(sampleDate).year()
        return dayjs(currDate).year() - year > 2
      })
      lastYear.map(obj => {
        return Check.findById(obj._id).then(obj => {
          return obj.remove()
        }).catch(err => console.log(err))
      })
      return dateFilter
    }).then(items => {
      items.map(obj => {
        Item.findById(obj.itemId._id).then(item => {
          item.amountCheck = false
          return item.save()
        }).catch(err => console.log(err))
      })
    })
  }
}

module.exports = scheduleEvent