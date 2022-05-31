//匯入資料
let recordsTotalNumber = document.querySelector('#recordsTotalNumber').innerText
let recordsTotalNumberObj = JSON.parse(recordsTotalNumber)
let recordsDay = document.querySelector('#recordsDay').innerText
let recordsDayObj = JSON.parse(recordsDay)



const lineChartData = {
  labels: recordsDayObj,//顯示區間名稱
  datasets: [{
    label: '一般溶劑', // tootip 出現的名稱
    lineTension: 0, // 曲線的彎度，設0 表示直線
    backgroundColor: "#ea464d",
    borderColor: "#ea464d",
    borderWidth: 5,
    data: recordsTotalNumberObj, // 資料
    fill: false, // 是否填滿色彩
  }]
}



const ctx = document.querySelector("#myChart").getContext("2d");


let myChart = new Chart(ctx, {  //先建立一個 chart
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
        fontSize: 10
      }],
      yAxes: [{
        display: true
      }]
    },
  }
});







