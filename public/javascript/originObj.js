const xlsx = require('xlsx')
const dayjs = require('dayjs')


function originObj(start, end) {
  //讀取EXCEL
  let workbook = xlsx.readFile(`./public/xlsx/原料篩選.xlsx`)
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
    obj['品  號'] = arr[i + 3]
    obj['批 號'] = arr[i + 4]
    obj['品名'] = arr[i + 5]
    obj['數  量'] = arr[i + 6]
    obj['單 位'] = arr[i + 7]
    obj['供  應  商  簡  稱'] = arr[i + 8]
    obj['取樣數'] = arr[i + 9]
    obj['等級'] = arr[i + 10]
    obj['包裝數'] = arr[i + 11]
    obj['包裝單位'] = arr[i + 12]
    obj['工作分配'] = arr[i + 13]
    obj['完成日期'] = arr[i + 14]
    obj['判定'] = arr[i + 15]
    obj['是否取樣'] = arr[i + 16]
    obj['是否取樣'] = arr[i + 17]
    obj['COA'] = arr[i + 18]
    obj['異常原因'] = arr[i + 19]
    obj['外觀'] = arr[i + 20]
    obj['純度'] = arr[i + 21]
    obj['比重'] = arr[i + 22]
    obj['水分'] = arr[i + 23]
    i += 22
    objarr.push(obj)
  }
  const s = '2021/05/01'
  const e = '2022/7/01'

  function filterItems(a) {
    const filterObj = objarr.filter(objs => {
      return objs.判定 === a
    }).filter(objs => {
      return dayjs(objs.完成日期).format('YYYY') >= dayjs(s).format('YYYY') && dayjs(objs.完成日期).format('YYYY') <= dayjs(e).format('YYYY')
    }).filter(objs => {
      if (dayjs(s).format('YYYY') === dayjs(e).format('YYYY')) {
        return dayjs(objs.完成日期).month() >= dayjs(s).month() && dayjs(objs.完成日期).month() <= dayjs(e).month()
      } else if (dayjs(s).format('YYYY') < dayjs(e).format('YYYY')) {
        if (dayjs(objs.完成日期).format('YYYY') === dayjs(s).format('YYYY')) {
          return dayjs(objs.完成日期).month() >= dayjs(s).month() && dayjs(objs.完成日期).month() <= 11
        } else if (dayjs(objs.完成日期).format('YYYY') === dayjs(e).format('YYYY')) {
          return dayjs(objs.完成日期).month() >= 0 && dayjs(objs.完成日期).month() <= dayjs(e).month()
        } else {
          return dayjs(objs.完成日期).month() >= 0 && dayjs(objs.完成日期).month() <= 11
        }
      }
    })
    return filterObj
  }

  const filterPassObj = filterItems('合格')
  const filterFailObj = filterItems('不合格')


  // 將資料轉成workSheet
  // let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
  let acnDataSheet = xlsx.utils.json_to_sheet(objarr);
  let failSheet = xlsx.utils.json_to_sheet(filterFailObj);
  let passSheet = xlsx.utils.json_to_sheet(filterPassObj);

  let workBook = {
    // SheetNames: ['arrayWorkSheet', 'jsonWorkSheet', '原料數據'],
    SheetNames: ['原料數據'],
    Sheets: {
      // 'arrayWorkSheet': arrayWorkSheet,
      // 'jsonWorkSheet': jsonWorkSheet,
      '原料數據': acnDataSheet,
    }
  };
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
  xlsx.writeFile(workBook, `./public/xlsx/originObj.xlsx`);
  xlsx.writeFile(failBook, `./public/xlsx/原料不合格品.csv`);
  xlsx.writeFile(passBook, `./public/xlsx/原料合格品.csv`);

}


module.exports = originObj