const Check = require('../../models/check')
const Item = require('../../models/item')
const Instrument = require('../../models/instrument')
const InstrumentRecord = require('../../models/instrumentRecord')
const dayjs = require('dayjs')


//找出當月最後一天
function monthEndDate(a) {
  return dayjs(dayjs(a).format()).endOf('month').format('YYYY/MM/DD').slice(8, 10)
}
//找出日期到月底天數差
function dateDiffer(a) {
  return monthEndDate(a) - dayjs(dayjs(a).format('YYYY/MM/DD')).date()
}
//找出月初到當前日期的天數差
function dateStart(a) {
  return dayjs(dayjs(a).format('YYYY/MM/DD')).date() - 1
}

const scheduleEvent = {
  checkSchedule: () => {
    Check.find().lean().then(obj => {
      const currDate = dayjs().format('YYYY/MM/DD')
      const dateFilter = obj.filter(items => {
        const sampleDate = dayjs(items.nextTime).format('YYYY/MM/DD')
        //當前日期等於下次盤點日期或是兩者相差14天amountCheck = false 系統撈出需要盤點的項目
        if (dayjs().day() === 1) {
          return true
        } else {
          if (dayjs(items.nextTime).format('YYYY/MM') === dayjs().format('YYYY/MM')) {
            return sampleDate === currDate || dayjs(currDate).date() - dayjs(sampleDate).date() > 14
          } else {
            if (dayjs(items.nextTime).format('MM') === 12 && dayjs().format('MM') === 1) {
              //12月份跨年到1月的天數和
              const december = dateDiffer(items.nextTime)
              const january = dateStart(dayjs().format('DD')) - 1
              const decSunJanDate = december + january
              return decSunJanDate > 14
            }
            else if (
              //同年但不同月份，且當前月份大於下次盤點月份的14天
              dayjs(items.nextTime).format('YYYY') === dayjs().format('YYYY') &&
              dayjs(items.nextTime).format('MM') !== dayjs().format('MM')) {
              if (dayjs().format('MM') > dayjs(items.nextTime).format('MM')) {
                return dateDiffer(items.nextTime) + dayjs().format('DD') > 14
              } else {
                return false
              }
            }
            else {
              return false
            }
          }
        }
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
      console.log('盤點狀態初始化')
      items.map(obj => {
        Item.findById(obj.itemId._id).then(item => {
          item.amountCheck = false
          return item.save()
        }).catch(err => console.log(err))
      })
    })
  },
  instrumentSchedule: () => {
    InstrumentRecord.find().populate(['instrumentId', 'userId']).lean().then(
      objs => {
        //禮拜一重置儀器狀態或是超過7天重置狀態
        const currDate = dayjs().format('YYYY/MM/DD')
        const objDate = dayjs(objs.createAt).format('YYYY/MM/DD')
        const objsFilter = objs.filter(objs => {
          if (dayjs().day() === 1) {
            return true
          } else {
            if (dayjs(objs.createAt).format('YYYY') === dayjs().format('YYYY')) {
              return dayjs(currDate).date() - dayjs(objDate).date() > 7
            } else {
              if (dayjs(objs.createAt).format('MM') === 12 && dayjs().format('MM') === 1) {
                const december = dateDiffer(objDate)
                const january = dateStart(currDate) - 1
                const decSunJanDate = december + january
                return decSunJanDate > 14
              } else if (
                //同年但不同月份，且當前月份大於下次盤點月份的14天
                dayjs(objDate).format('YYYY') === dayjs().format('YYYY') && dayjs(objDate).format('MM') !== dayjs().format('MM')) {
                if (dayjs().format('MM') > dayjs(objDate).format('MM')) {
                  return dateDiffer(objDate) + dayjs().format('DD') > 7
                } else {
                  return false
                }
              }
              else {
                return false
              }
            }
          }
        })
        return objsFilter
      }).then(objs => {
        console.log('儀器狀態初始化')
        objs.map(obj => {
          Instrument.findById(obj.instrumentId._id).then(inst => {
            inst.checkState = false
            return inst.save()
          })
        })
      }).catch(err => console.log(err))
  }
}



module.exports = scheduleEvent