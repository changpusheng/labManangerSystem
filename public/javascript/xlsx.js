const xlsx = require('xlsx')
const dayjs = require('dayjs')
const currentDate = dayjs().format('YYYYMM')
const fs = require('fs')

function xlsxfn(time, title, use, stock, user, total) {
  fs.access(`./public/xlsx/${currentDate}.xlsx`, function (err) {
    if (err === null) {
      //讀取EXCEL
      let workbook = xlsx.readFile(`./public/xlsx/${currentDate
        }.xlsx`)
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
            row_value += sheet3[cell].v + ", ";
            arr.push(sheet3[cell].v)
          } else {
            row_value += ", ";
          }
        }
        // console.log(row_value);
      }
      const objarr = []
      const acnData = {}
      acnData['領用時間'] = time
      acnData['溶劑名稱'] = title
      acnData['使用量'] = use
      acnData['剩餘數量'] = stock
      acnData['瓶裝數'] = total
      acnData['領用人'] = user


      for (let i = 6; i < arr.length; i++) {
        const obj = {}
        obj['領用時間'] = arr[i]
        obj['溶劑名稱'] = arr[i + 1]
        obj['使用量'] = arr[i + 2]
        obj['剩餘數量'] = arr[i + 3]
        obj['瓶裝數'] = arr[i + 4]
        obj['領用人'] = arr[i + 5]
        i += 5
        objarr.push(obj)
      }
      objarr.push(acnData)
      // 將資料轉成workSheet
      // let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
      let acnDataSheet = xlsx.utils.json_to_sheet(objarr);

      let workBook = {
        // SheetNames: ['arrayWorkSheet', 'jsonWorkSheet', 'inputData'],
        SheetNames: ['inputData'],
        Sheets: {
          // 'arrayWorkSheet': arrayWorkSheet,
          // 'jsonWorkSheet': jsonWorkSheet,
          'inputData': acnDataSheet,
        }
      };
      // 將workBook寫入檔案
      return xlsx.writeFile(workBook, `./public/xlsx/${currentDate
        }.xlsx`);
    } else if (err.code === "ENOENT") {
      //    檔案和目錄不存在的情況下；
      const objarr = []
      const acnData = {}
      acnData['領用時間'] = time
      acnData['溶劑名稱'] = title
      acnData['使用量'] = use
      acnData['剩餘數量'] = stock
      acnData['瓶裝數'] = total
      acnData['領用人'] = user
      objarr.push(acnData)
      let acnDataSheet = xlsx.utils.json_to_sheet(objarr);
      let workBook = {
        SheetNames: ['inputData'],
        Sheets: {
          'inputData': acnDataSheet,
        }
      };
      // 將workBook寫入檔案
      return xlsx.writeFile(workBook, `./public/xlsx/${currentDate
        }.xlsx`);
    }
  })



}


module.exports = xlsxfn