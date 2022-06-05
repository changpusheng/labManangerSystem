const chartNormalBtn = document.querySelector('#normalSolvent')
const chartToxicBtn = document.querySelector('#toxicSolvent')
const monthBtn = document.querySelector('#month')
const weekBtn = document.querySelector('#week')
const dayBtn = document.querySelector('#day')
const normalMonth = document.querySelector('#myChartNormalMonth')
const toxicMonth = document.querySelector('#myChartToxicMonth')
const normalWeek = document.querySelector('#myChartNormalWeek')
const toxicWeek = document.querySelector('#myChartToxicWeek')
const normalDay = document.querySelector('#myChartNormalDay')
const toxicDay = document.querySelector('#myChartToxicDay')

initChart = () => {
  normalMonth.hidden = true
  toxicMonth.hidden = true
  toxicWeek.hidden = true
  normalWeek.hidden = true
  toxicDay.hidden = true
  normalDay.hidden = true
}
initBtn = () => {
  dayBtn.classList.remove('active')
  monthBtn.classList.remove('active')
  weekBtn.classList.remove('active')
}


//一般溶劑事件
chartNormalBtn.addEventListener('click', () => {
  initChart()
  chartNormalBtn.classList.add('active')
  chartToxicBtn.classList.remove('active')
  if (weekBtn.matches('.active')) {
    return normalWeek.hidden = false
  } else if (dayBtn.matches('.active')) {
    return normalDay.hidden = false
  } else {
    return normalMonth.hidden = false
  }

})

//毒化物事件
chartToxicBtn.addEventListener('click', () => {
  initChart()
  chartToxicBtn.classList.add('active')
  chartNormalBtn.classList.remove('active')
  if (weekBtn.matches('.active')) {
    return toxicWeek.hidden = false
  } else if (dayBtn.matches('.active')) {
    return toxicDay.hidden = false
  } else {
    return toxicMonth.hidden = false
  }
})

//月線
monthBtn.addEventListener('click', () => {
  initBtn()
  monthBtn.classList.add('active')
  if (chartNormalBtn.matches('.active')) {
    initChart()
    return normalMonth.hidden = false
  } else {
    initChart()
    return toxicMonth.hidden = false
  }
})
//週線
weekBtn.addEventListener('click', () => {
  initBtn()
  weekBtn.classList.add('active')
  if (chartNormalBtn.matches('.active')) {
    initChart()
    return normalWeek.hidden = false
  } else {
    initChart()
    return toxicWeek.hidden = false
  }
})
//日線
dayBtn.addEventListener('click', () => {
  initBtn()
  dayBtn.classList.add('active')
  if (chartNormalBtn.matches('.active')) {
    initChart()
    return normalDay.hidden = false
  } else {
    initChart()
    return toxicDay.hidden = false
  }
})