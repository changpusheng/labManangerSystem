const xlsx = require('xlsx')
const dayjs = require('dayjs')
const dimStringSearch = require('../javascript/dimStringSearch')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.originObjXlsxUrl
const passUrl = process.env.originPass
const failUrl = process.env.originFail

const originObj = {
  readData: (start, end, search, lot) => {
    //讀取EXCEL
    let workbook = xlsx.readFile(url)
    let sheetNames = workbook.SheetNames;
    // 獲取第一個workSheet
    let sheet3 = workbook.Sheets[sheetNames[0]];
    // console.log(sheet1);

    let range = xlsx.utils.decode_range(sheet3['!ref']);
    const arr = []
    //迴圈獲取單元格值
    for (let R = range.s.r; R <= range.e.r; ++R) {
      let row_value = '';
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cell_address = { c: C, r: R }; //獲取單元格地址
        let cell = xlsx.utils.encode_cell(cell_address); //根據單元格地址獲取單元格
        //獲取單元格值
        if (sheet3[cell]) {
          // 如果出現亂碼可以使用iconv-lite進行轉碼
          // row_value += iconv.decode(sheet1[cell].v, 'gbk') + ", ";
          // row_value += sheet3[cell].v + ", ";
          arr.push(sheet3[cell].v)
        } else {
          row_value += ", ";
          arr.push("-")
        }
      }
    }

    const objarr = []

    for (let i = 23; i < arr.length; i++) {
      const obj = {}
      obj['試訂'] = arr[i]
      obj['入廠日期'] = arr[i + 1]
      obj['交貨通知序號'] = arr[i + 2]
      obj['品號'] = arr[i + 3]
      obj['批號'] = arr[i + 4]
      obj['品名'] = arr[i + 5]
      obj['數量'] = arr[i + 6]
      obj['單 位'] = arr[i + 7]
      obj['供應商簡稱'] = arr[i + 8]
      obj['取樣數'] = arr[i + 9]
      obj['等級'] = arr[i + 10]
      obj['包裝數'] = arr[i + 11]
      obj['包裝單位'] = arr[i + 12]
      obj['工作分配'] = arr[i + 13]
      obj['完成日期'] = arr[i + 14]
      obj['判定'] = arr[i + 15]
      obj['是否取樣'] = arr[i + 16]
      obj['COA'] = arr[i + 17]
      obj['異常原因'] = arr[i + 18]
      obj['外觀'] = arr[i + 19]
      obj['純度'] = arr[i + 20]
      obj['比重'] = arr[i + 21]
      obj['水分'] = arr[i + 22]
      i += 22
      objarr.push(obj)
    }
    const s = start
    const e = end

    function filterItems(a) {
      const filterObj = objarr.filter(objs => {
        return objs.是否取樣 !== '-'
      }).filter(objs => {
        return objs.判定 === a
      }).filter(objs => {
        //篩選出年份內的物件
        return dayjs(objs.完成日期).format('YYYY') >= dayjs(s).format('YYYY') && dayjs(objs.完成日期).format('YYYY') <= dayjs(e).format('YYYY')
      }).filter(objs => {
        //篩選同年份
        if (dayjs(s).format('YYYY') === dayjs(e).format('YYYY')) {
          return dayjs(objs.完成日期).month() >= dayjs(s).month() && dayjs(objs.完成日期).month() <= dayjs(e).month()
        } else {
          //篩選不同年份
          if (dayjs(objs.完成日期).format('YYYY') === dayjs(s).format('YYYY')) {
            return dayjs(objs.完成日期).month() >= dayjs(s).month() && dayjs(objs.完成日期).month() <= 11
          } else if (dayjs(objs.完成日期).format('YYYY') === dayjs(e).format('YYYY')) {
            return dayjs(objs.完成日期).month() >= 0 && dayjs(objs.完成日期).month() <= dayjs(e).month()
          } else {
            //如果物件年份不等於搜尋開始日期也不等於結束日期，搜尋出1~12月
            return dayjs(objs.完成日期).month() >= 0 && dayjs(objs.完成日期).month() <= 11
          }
        }
      }).filter(objs => {
        //如果是搜尋同年同月，篩選出開始日期到結束日期物件
        if (dayjs(s).format('YYYY/MM') === dayjs(e).format('YYYY/MM')) {
          return dayjs(objs.完成日期).date() >= dayjs(s).date() && dayjs(objs.完成日期).date() <= dayjs(e).date()
        }
        //如果不同年份，個別篩出開始日期與結束日期物件
        if (dayjs(objs.完成日期).format('YYYY/MM') === dayjs(s).format('YYYY/MM')) {
          return dayjs(objs.完成日期).date() >= dayjs(s).date() && dayjs(objs.完成日期).date() <= dayjs(s).endOf('month').format('YYYY/MM/DD').slice(8, 10)
        } else if (dayjs(objs.完成日期).format('YYYY/MM') === dayjs(e).format('YYYY/MM')) {
          return dayjs(objs.完成日期).date() >= 0 && dayjs(objs.完成日期).date() <= dayjs(e).date()
        } else {
          //如果物件年份月份不等於搜尋開始日期也不等於結束日期，搜尋出1~31天
          return dayjs(objs.完成日期).date() >= 0 && dayjs(objs.完成日期).date() <= 31
        }
      }).filter(objs => {
        if (search) {
          return dimStringSearch(objs.品號, search)
        } else {
          return true
        }
      }).filter(objs => {
        if (lot) {
          return dimStringSearch(objs.批號, lot)
        } else {
          return true
        }
      })
      return filterObj
    }

    const filterPassObj = filterItems('合格')
    const filterFailObj = filterItems('不合格')

    return {
      objarr, filterPassObj, filterFailObj
    }
  },

  outputDate: (pass, fail) => {
    // 將資料轉成workSheet
    // let acnDataSheet = xlsx.utils.json_to_sheet(objarr);
    let failSheet = xlsx.utils.json_to_sheet(fail);
    let passSheet = xlsx.utils.json_to_sheet(pass);

    let failBook = {
      SheetNames: ['原料不合格品'],
      Sheets: {
        '原料不合格品': failSheet,
      }
    }
    let passBook = {
      SheetNames: ['原料合格品'],
      Sheets: {
        '原料合格品': passSheet,
      }
    }
    // 將workBook寫入檔案

    xlsx.writeFile(failBook, `${failUrl}`);
    xlsx.writeFile(passBook, `${passUrl}`);
  }
}



module.exports = originObj