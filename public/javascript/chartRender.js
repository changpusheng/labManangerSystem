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
let maxValueDay = document.querySelector('#maxValueDay').innerText
let maxValueToxicDay = document.querySelector('#maxValueToxicDay').innerText
let minValueDay = document.querySelector('#minValueDay').innerText
let minValueToxicDay = document.querySelector('#minValueToxicDay').innerText

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
let maxValueWeek = document.querySelector('#maxValueWeek').innerText
let maxValueToxicWeek = document.querySelector('#maxValueToxicWeek').innerText
let minValueWeek = document.querySelector('#minValueWeek').innerText
let minValueToxicWeek = document.querySelector('#minValueToxicWeek').innerText


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
let maxValueMonth = document.querySelector('#maxValueMonth').innerText
let maxValueToxicMonth = document.querySelector('#maxValueToxicMonth').innerText
let minValueMonth = document.querySelector('#minValueMonth').innerText
let minValueToxicMonth = document.querySelector('#minValueToxicMonth').innerText


function chartData(Day, data, maxValue, avg, minValue) {
  const avgLine = {
    display: true,
    type: 'line',
    yMin: avg,
    yMax: avg,
    borderColor: 'rgba(1,1,255,0.4)',
    borderWidth: 4,
    borderDash: [6, 5],
    label: {
      yAdjust: -12,
      backgroundColor: 'rgba(1,1,255,0.1)',
      position: 'start',
      font: {
        size: 16
      },
      color: 'black',
      content: `平均:${Math.ceil(avg)
        }`,
      enabled: false
    },
    enter({ chart, element }, event) {
      element.options.label.enabled = true;
      chart.draw();
    },
    leave({ chart, element }, event) {
      element.options.label.enabled = false;
      chart.draw();
    }
  }

  const maxLine = {
    type: 'line',
    yMin: maxValue,
    yMax: maxValue,
    borderColor: 'rgba(1,1,255,0.4)',
    borderWidth: 4,
    borderDash: [6, 5],
    label: {
      yAdjust: -15,
      backgroundColor: 'rgba(1,1,255,0.1)',
      position: 'start',
      font: {
        size: 16
      },
      color: 'black',
      content: `最大值:${Math.ceil(maxValue)
        }`,
      enabled: false
    },
    enter({ chart, element }, event) {
      element.options.label.enabled = true;
      chart.draw();
    },
    leave({ chart, element }, event) {
      element.options.label.enabled = false;
      chart.draw();
    }
  }

  const minLine = {
    type: 'line',
    yMin: minValue,
    yMax: minValue,
    borderColor: 'rgba(1,1,255,0.4)',
    borderWidth: 4,
    borderDash: [6, 5],
    label: {
      yAdjust: 15,
      backgroundColor: 'rgba(1,1,255,0.1)',
      position: 'start',
      font: {
        size: 16
      },
      color: 'black',
      content: `最小值:${Math.ceil(minValue)
        }`,
      enabled: false
    },
    enter({ chart, element }, event) {
      element.options.label.enabled = true;
      chart.draw();
    },
    leave({ chart, element }, event) {
      element.options.label.enabled = false;
      chart.draw();
    }
  }

  const chartObj = new Chart(Day, {  //先建立一個 chart
    type: 'line', // 型態
    data: data,
    options: {
      responsive: true,
      legend: { //是否要顯示圖示
        display: true,
      },
      tooltips: { //是否要顯示 tooltip
        enabled: true,
      },
      scales: {  //是否要顯示 x、y 軸
        x: {
          display: true,
          fontSize: 10,
          suggestedMin: 0
        },
        y: {
          display: true,
          suggestedMax: Math.ceil(maxValue) * 1.5,
          suggestedMin: -2
        }
      },
      plugins: {
        autocolors: false,
        annotation: {
          annotations: {
            avgLine,
            maxLine,
            minLine
          }
        }
      }
    }
  });

  return chartObj
}

//每日
const lineChartDataDay = {
  labels: recordsDayObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶/日)-每日', // tootip 出現的名稱
    lineTension: 0.3, // 曲線的彎度，設0 表示直線
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
    lineTension: 0.3, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicNumberDay, // 資料
    fill: false, // 是否填滿色彩
  }]
}

const ctxNormalDay = document.querySelector("#myChartNormalDay").getContext("2d");
const ctxToxicDay = document.querySelector("#myChartToxicDay").getContext("2d");


chartData(ctxNormalDay, lineChartDataDay, maxValueDay, avgNumberDay, minValueDay)
chartData(ctxToxicDay, toxicDataDay, maxValueToxicDay, avgTxicNumberDay, minValueToxicDay)

//每週


const ctxNormalWeek = document.querySelector("#myChartNormalWeek").getContext("2d");
const ctxToxicWeek = document.querySelector("#myChartToxicWeek").getContext("2d");

const lineChartDataWeek = {
  labels: recordsWeekObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶/週)-每週', // tootip 出現的名稱
    lineTension: 0.3, // 曲線的彎度，設0 表示直線
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
    lineTension: 0.3, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicNumberWeek, // 資料
    fill: false, // 是否填滿色彩
  }]
}

chartData(ctxNormalWeek, lineChartDataWeek, maxValueWeek, avgNumberWeek, minValueWeek)
chartData(ctxToxicWeek, toxicDataWeek, maxValueToxicWeek, avgTxicNumberWeek, minValueToxicWeek)

//每月
const lineChartData = {
  labels: recordsMonthObj, //顯示區間名稱
  datasets: [{
    label: '一般溶劑(單位:瓶/月)-每月', // tootip 出現的名稱
    lineTension: 0.3, // 曲線的彎度，設0 表示直線
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
    lineTension: 0.3, // 曲線的彎度，設0 表示直線
    backgroundColor: "#29b288",
    borderColor: "#29b288",
    borderWidth: 1,
    data: recordsToxicTotalNumberObj, // 資料
    fill: false, // 是否填滿色彩
  }]
}

const ctxNormal = document.querySelector("#myChartNormalMonth").getContext("2d");
const ctxToxic = document.querySelector("#myChartToxicMonth").getContext("2d");

chartData(ctxNormal, lineChartData, maxValueMonth, normalAvgMonth, minValueMonth)
chartData(ctxToxic, toxicData, maxValueToxicMonth, toxicAvgMonth, minValueToxicMonth)




