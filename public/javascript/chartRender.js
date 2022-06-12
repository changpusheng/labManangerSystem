//匯入資料
//每日
//一般溶劑

let recordsValue = JSON.parse(document.querySelector('#recordsValue').innerText)
let categoryObj = JSON.parse(document.querySelector('#categoryObj').innerText)


function chartData(displayPosition, labelData, ValueData, maxValue, avg, minValue, date) {

  const ctxNormalDay = document.querySelector(`#${displayPosition
    }${date}`).getContext("2d");

  const lineChartDataDay = {
    labels: labelData, //顯示區間名稱
    datasets: [{
      label: `${displayPosition}-${date
        }`, // tootip 出現的名稱
      lineTension: 0.3, // 曲線的彎度，設0 表示直線
      backgroundColor: "#ea464d",
      borderColor: "#ea464d",
      borderWidth: 1,
      data: ValueData, // 資料
      fill: false, // 是否填滿色彩
    }
    ]
  }

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

  const chartObj = new Chart(ctxNormalDay, {  //先建立一個 chart
    type: 'line', // 型態
    data: lineChartDataDay,
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

for (let i = 0; i < categoryObj.length; i++) {
  chartData(categoryObj[i].name, recordsValue.day[i].day, recordsValue.day[i].value, recordsValue.day[i].max, recordsValue.day[i].avg, recordsValue.day[i].min, recordsValue.day[i].date)
}

for (let i = 0; i < categoryObj.length; i++) {
  chartData(categoryObj[i].name, recordsValue.week[i].day, recordsValue.week[i].value, recordsValue.week[i].max, recordsValue.week[i].avg, recordsValue.week[i].min, recordsValue.week[i].date)
}

for (let i = 0; i < categoryObj.length; i++) {
  chartData(categoryObj[i].name, recordsValue.month[i].day, recordsValue.month[i].value, recordsValue.month[i].max, recordsValue.month[i].avg, recordsValue.month[i].min, recordsValue.month[i].date)
}


const monthBtn = document.querySelector('#month')
const weekBtn = document.querySelector('#week')
const dayBtn = document.querySelector('#day')
const categoryBtn = document.querySelector('#categoryId')
let date = 'day'
let categoryIndex = 0


initBtn = () => {
  dayBtn.classList.remove('active')
  monthBtn.classList.remove('active')
  weekBtn.classList.remove('active')
}

dayBtn.addEventListener('click', e => {
  const target = e.target
  initBtn()
  target.classList.add('active')
  date = target.id
  const selectObj = target.parentNode.parentNode.children[0].children[0]
  for (let i = 0; i < selectObj.length; i++) {
    document.querySelector(`#${selectObj.options[i].value
      }day`).hidden = true
    document.querySelector(`#${selectObj.options[i].value
      }week`).hidden = true
    document.querySelector(`#${selectObj.options[i].value
      }month`).hidden = true
  }
  document.querySelector(`#${selectObj.options[categoryIndex].value
    }day`).hidden = false
})

weekBtn.addEventListener('click', e => {
  const target = e.target
  initBtn()
  target.classList.add('active')
  date = target.id
  const selectObj = target.parentNode.parentNode.children[0].children[0]
  for (let i = 0; i < selectObj.length; i++) {
    document.querySelector(`#${selectObj.options[i].value
      }day`).hidden = true
    document.querySelector(`#${selectObj.options[i].value
      }week`).hidden = true
    document.querySelector(`#${selectObj.options[i].value
      }month`).hidden = true
  }
  document.querySelector(`#${selectObj.options[categoryIndex].value
    }week`).hidden = false
})

monthBtn.addEventListener('click', e => {
  const target = e.target
  initBtn()
  target.classList.add('active')
  date = target.id
  const selectObj = target.parentNode.parentNode.children[0].children[0]
  for (let i = 0; i < selectObj.length; i++) {
    document.querySelector(`#${selectObj.options[i].value
      }day`).hidden = true
    document.querySelector(`#${selectObj.options[i].value
      }week`).hidden = true
    document.querySelector(`#${selectObj.options[i].value
      }month`).hidden = true
  }
  document.querySelector(`#${selectObj.options[categoryIndex].value
    }month`).hidden = false
})

categoryBtn.addEventListener('change', e => {
  const target = e.target
  for (let i = 0; i < categoryObj.length; i++) {
    document.querySelector(`#${target.options[i].value
      }day`).hidden = true
    document.querySelector(`#${target.options[i].value
      }week`).hidden = true
    document.querySelector(`#${target.options[i].value
      }month`).hidden = true
  }
  document.querySelector(`#${target.options[target.selectedIndex].value
    }${date}`).hidden = false
  categoryIndex = target.selectedIndex
})



