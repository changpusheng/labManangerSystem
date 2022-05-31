//匯入資料

let recordsToxicTotalNumber = document.querySelector('#recordsToxicTotalNumber').innerText
let recordsToxicTotalNumberObj = JSON.parse(recordsToxicTotalNumber)
let recordsToxicDay = document.querySelector('#recordsToxicDay').innerText
let recordsToxicDayObj = JSON.parse(recordsToxicDay)


const toxicData = {
  labels: recordsToxicDayObj,//顯示區間名稱
  datasets: [{
    label: '毒化物', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#ea464d",
    borderColor: "#ea464d",
    borderWidth: 5,
    data: recordsToxicTotalNumberObj, // 資料
    fill: false, // 是否填滿色彩
  }]
}


const toxicCtx = document.querySelector('#toxicChart').getContext("2d");


let toxicChart = new Chart(toxicCtx, {  //先建立一個 chart
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
        fontSize: 10
      }],
      yAxes: [{
        display: true
      }]
    },
  }
});
