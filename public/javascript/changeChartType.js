const chartNormalBtn = document.querySelector('#normalSolvent')
const chartToxicBtn = document.querySelector('#toxicSolvent')
const normal = document.querySelector('#myChartNormal')
const toxic = document.querySelector('#myChartToxic')

chartNormalBtn.addEventListener('click', () => {
  toxic.hidden = true
  normal.hidden = false
  chartNormalBtn.classList.add('active')
  chartToxicBtn.classList.remove('active')
})  

chartToxicBtn.addEventListener('click', () => {
  normal.hidden = true
  toxic.hidden = false
  chartToxicBtn.classList.add('active')
  chartNormalBtn.classList.remove('active')
})