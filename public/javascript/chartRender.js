//匯入資料
let recordsTotalNumber = document.querySelector('#recordsTotalNumber').innerText
let recordsTotalNumberObj = JSON.parse(recordsTotalNumber).slice(-25)
let recordsDay = document.querySelector('#recordsDay').innerText
let recordsDayObj = JSON.parse(recordsDay).slice(-25)
let normalAvg = document.querySelector('#normalAvg').innerText
let toxicAvg = document.querySelector('#toxicAvg').innerText

//匯入毒化物資料

let recordsToxicTotalNumber = document.querySelector('#recordsToxicTotalNumber').innerText
let recordsToxicTotalNumberObj = JSON.parse(recordsToxicTotalNumber).slice(-25)
let recordsToxicDay = document.querySelector('#recordsToxicDay').innerText
let recordsToxicDayObj = JSON.parse(recordsToxicDay).slice(-25)

const lineChartData = {
  labels: recordsDayObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶)', // tootip 出現的名稱
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
  labels: recordsToxicDayObj,//顯示區間名稱
  datasets: [{
    label: '毒化物(單位:KG)', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicTotalNumberObj, // 資料
    fill: false, // 是否填滿色彩
  }]
}

const ctxNormal = document.querySelector("#myChartNormal").getContext("2d");
const ctxToxic = document.querySelector("#myChartToxic").getContext("2d");


//一般溶劑每月
let myChartNormal = new Chart(ctxNormal, {  //先建立一個 chart
  type: 'line', // 型態
  data: lineChartData,
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
          max: Math.ceil(Number(normalAvg)) * 2,
          min: 0
        }
      }]
    },
  }
});

//毒化物每月
let myChartToxic = new Chart(ctxToxic, {  //先建立一個 chart
  type: 'line', // 型態
  data: toxicData,
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
          max: Math.ceil(Number(toxicAvg)) * 2,
          min: 0
        }
      }]
    },
  }
});




