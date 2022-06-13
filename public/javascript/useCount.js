const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

function useMonthNumber(records, category, day) {
  //一般溶劑使用量
  //撈出每月溶劑使用量
  const chartDateArr = []
  const chartDateOutNumber = []
  const outputDataArr = []

  const normalObj = records.filter(obj => {
    return obj.itemId.categoryId.name === category
  })
  normalObj.map(obj => {
    const date = dayjs(obj.createAt).format(`${day
      }`)
    chartDateArr.push(date)
  })
  //剔除重覆的元素
  const chartDateFilter = chartDateArr.filter((date, index) => {
    return chartDateArr.indexOf(date) === index
  })
  //使用量加入陣列
  for (let i = 0; i < chartDateFilter.length; i++) {
    const itemFilter = normalObj.filter(obj => {
      return dayjs(obj.createAt).format(`${day
        }`) === chartDateFilter[i]
    })
    const itemMap = itemFilter.map(obj => obj.outNumber)
    const init = 0
    const outNumberTotalValue = itemMap.reduce((pre, curr) => pre + curr, init)
    chartDateOutNumber.push(outNumberTotalValue)
  }
  //物件寫入日期與使用量
  for (let i = 0; i < chartDateFilter.length; i++) {
    const outputData = {}
    outputData['date'] = dayjs(chartDateFilter[i]).format()
    outputData['number'] = chartDateOutNumber[i]
    outputDataArr.push(outputData)
  }
  //依照日期排序
  const daySort = outputDataArr.sort((a, b) => {
    return a > b ? 1 : -1
  })
  return daySort
}

function useWeekNumber(records, category, day) {
  const chartDateArr = []

  const normalObj = records.filter(obj => {
    return obj.itemId.categoryId.name === category
  })

  normalObj.map(obj => {
    const date = dayjs(obj.createAt).format(`${day
      }`)
    chartDateArr.push(date)
  })

  //剔除重覆的元素
  const chartDateFilter = chartDateArr.filter((date, index) => {
    return chartDateArr.indexOf(date) === index
  })

  const weekOfYear = []
  for (let i = 0; i < chartDateFilter.length; i++) {
    const maxWeekYear = {}
    const date = dayjs(chartDateFilter[i]).endOf('year').format('YYYY/MM/DD')
    const itemFilter = normalObj.filter(obj => {
      return dayjs(obj.createAt).format(`${day
        }`) === chartDateFilter[i]
    })
    const itemMap = itemFilter.map(obj => obj.outNumber)
    const init = 0
    const outNumberTotalValue = itemMap.reduce((pre, curr) => pre + curr, init)

    let maxWeek = dayjs(chartDateFilter[i]).week()

    maxWeekYear['date'] = chartDateFilter[i]
    maxWeekYear['week'] = maxWeek
    maxWeekYear['number'] = outNumberTotalValue
    weekOfYear.push(maxWeekYear)
  }
  const yearArr = []
  weekOfYear.map(obj => {
    const yearObj = dayjs(obj.date).format('YYYY')
    yearArr.push(yearObj)
  })

  //剔除重覆的元素
  const yearFilter = yearArr.filter((date, index) => {
    return yearArr.indexOf(date) === index
  })

  const weekYearFilterArr = []
  for (let i = 0; i < yearFilter.length; i++) {
    //step1 篩出年分
    const weekYearFilter = weekOfYear.filter(obj => {
      return dayjs(obj.date).format('YYYY') === yearFilter[i]
    })
    //step2 篩出週期
    const weekNumberMap = weekYearFilter.map(obj => {
      return obj.week
    })

    const weekOnly = weekNumberMap.filter((date, index) => {
      return weekNumberMap.indexOf(date) === index
    })

    //篩出 年份 週期 總使用數量
    for (let j = 0; j < weekOnly.length; j++) {
      const weekYearFilterObj = {}
      const filter = weekYearFilter.filter(obj => {
        return obj.week === weekOnly[j]
      }).map(obj => {
        return obj.number
      })
      const init = 0
      const value = filter.reduce((pre, curr) => pre + curr, init)
      let yearWeek = `第${weekOnly[j] + '週'}`
      weekYearFilterObj['year'] = yearWeek
      weekYearFilterObj['value'] = value
      weekYearFilterArr.push(weekYearFilterObj)
    }
  }


  //依照日期排序
  const daySort = weekYearFilterArr.sort((a, b) => {
    return a > b ? 1 : -1
  })

  return daySort
}


function avgCount(normalTotalNumber, normalTotalDay) {
  //一般溶劑使用平
  const init = 0
  let dayValue = normalTotalDay.length
  if (!dayValue) {
    dayValue = 1
  }
  const totalNormalNumber = normalTotalNumber.reduce((pre, curr) => pre + curr, init)
  const avgNumber = totalNormalNumber / dayValue
  return avgNumber
}



module.exports = {
  useMonthNumber,
  useWeekNumber,
  avgCount
}