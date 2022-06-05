//匯入資料
//每日
//一般溶劑
let recordsTotalNumberDay = document.querySelector('#recordsTotalNumberDay').innerText
let recordsNumberDay = JSON.parse(recordsTotalNumberDay).slice(-25)
let recordsDay = document.querySelector('#recordsDay').innerText
let recordsDayObj = JSON.parse(recordsDay).slice(-25)
let avgNumberDay = document.querySelector('#avgNumberDay').innerText
//毒化物
let recordsToxicTotalNumberDay = document.querySelector('#recordsToxicTotalNumberDay').innerText
let recordsToxicNumberDay = JSON.parse(recordsToxicTotalNumberDay).slice(-25)
let recordsToxicDay = document.querySelector('#recordsToxicDay').innerText
let recordsToxicDayObj = JSON.parse(recordsToxicDay).slice(-25)
let avgTxicNumberDay = document.querySelector('#avgTxicNumberDay').innerText

//每週
let recordsTotalNumberWeek = document.querySelector('#recordsTotalNumberWeek').innerText
let recordsNumberWeek = JSON.parse(recordsTotalNumberWeek).slice(-25)
let recordsWeek = document.querySelector('#recordsWeek').innerText
let recordsWeekObj = JSON.parse(recordsWeek).slice(-25)
let avgNumberWeek = document.querySelector('#avgNumberWeek').innerText
//毒化物
let recordsToxicTotalNumberWeek = document.querySelector('#recordsToxicTotalNumberWeek').innerText
let recordsToxicNumberWeek = JSON.parse(recordsToxicTotalNumberWeek).slice(-25)
let recordsToxicWeek = document.querySelector('#recordsToxicWeek').innerText
let recordsToxicWeekObj = JSON.parse(recordsToxicWeek).slice(-25)
let avgTxicNumberWeek = document.querySelector('#avgTxicNumberWeek').innerText

//每月
//一般溶劑
let recordsTotalNumber = document.querySelector('#recordsTotalNumber').innerText
let recordsTotalNumberObj = JSON.parse(recordsTotalNumber).slice(-25)
let recordsMonth = document.querySelector('#recordsMonth').innerText
let recordsMonthObj = JSON.parse(recordsMonth).slice(-25)
let normalAvgMonth = document.querySelector('#normalAvgMonth').innerText
//毒化物
let recordsToxicTotalNumber = document.querySelector('#recordsToxicTotalNumber').innerText
let recordsToxicTotalNumberObj = JSON.parse(recordsToxicTotalNumber).slice(-25)
let recordsToxicMonth = document.querySelector('#recordsToxicMonth').innerText
let recordsToxicMonthObj = JSON.parse(recordsToxicMonth).slice(-25)
let toxicAvgMonth = document.querySelector('#toxicAvgMonth').innerText

//每日
const lineChartDataDay = {
  labels: recordsDayObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶/日)-每日', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#ea464d",
    borderColor: "#ea464d",
    borderWidth: 1,
    data: recordsNumberDay, // 資料
    fill: false, // 是否填滿色彩
  }
  ]
}

const toxicDataDay = {
  labels: recordsToxicDayObj,//顯示區間名稱
  datasets: [{
    label: '毒化物(單位:KG/日)-每日', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicNumberDay, // 資料
    fill: false, // 是否填滿色彩
  }]
}

const ctxNormalDay = document.querySelector("#myChartNormalDay").getContext("2d");
const ctxToxicDay = document.querySelector("#myChartToxicDay").getContext("2d");


function chartData(Day, data, avg) {
  const chartObj = new Chart(Day, {  //先建立一個 chart
    type: 'line', // 型態
    data: data,
    options: {
      responsive: true,
      legend: { //是否要顯示圖示
        display: true,
      },
      tooltips: { //是否要顯示 tooltip
        enabled: true
      },
      scales: {  //是否要顯示 x、y 軸
        xAxes: [{
          display: true,
          fontSize: 10,
          ticks: {
            min: 0
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            max: Math.ceil(avg) * 2,
            min: 0
          }
        }]
      },
    }
  });

  return chartObj
}

chartData(ctxNormalDay, lineChartDataDay, avgNumberDay)
chartData(ctxToxicDay, toxicDataDay, avgTxicNumberDay)

//每週


const ctxNormalWeek = document.querySelector("#myChartNormalWeek").getContext("2d");
const ctxToxicWeek = document.querySelector("#myChartToxicWeek").getContext("2d");

const lineChartDataWeek = {
  labels: recordsWeekObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶/週)-每週', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#ea464d",
    borderColor: "#ea464d",
    borderWidth: 1,
    data: recordsNumberWeek, // 資料
    fill: false, // 是否填滿色彩
  }
  ]
}

const toxicDataWeek = {
  labels: recordsToxicWeekObj,//顯示區間名稱
  datasets: [{
    label: '毒化物(單位:KG/週)-每週', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicNumberWeek, // 資料
    fill: false, // 是否填滿色彩
  }]
}

chartData(ctxNormalWeek, lineChartDataWeek, avgNumberWeek)
chartData(ctxToxicWeek, toxicDataWeek, avgTxicNumberWeek)

//每月
const lineChartData = {
  labels: recordsMonthObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶/月)-每月', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#ea464d",
    borderColor: "#ea464d",
    borderWidth: 1,
    data: recordsTotalNumberObj, // 資料
    fill: false, // 是否填滿色彩
  }
  ]
}

const toxicData = {
  labels: recordsToxicMonthObj,//顯示區間名稱
  datasets: [{
    label: '毒化物(單位:KG/月)-每月', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicTotalNumberObj, // 資料
    fill: false, // 是否填滿色彩
  }]
}

const ctxNormal = document.querySelector("#myChartNormalMonth").getContext("2d");
const ctxToxic = document.querySelector("#myChartToxicMonth").getContext("2d");

chartData(ctxNormal, lineChartData, normalAvgMonth)
chartData(ctxToxic, toxicData, toxicAvgMonth)




