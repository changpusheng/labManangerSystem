let shoppingGetJsonData = document.querySelector('.shoppingdatafilter').innerText
let buyItemId = JSON.parse(shoppingGetJsonData)

function list(data) {
  const contentTitle = `<table class="table table-striped">
  <thead>
  <tr>
    <th scope="col">流水號</th>
    <th scope="col">品名</th>
    <th scope="col">購買數量</th>
    <th scope="col">訂單時間</th>
    <th scope="col">請購人</th>
    <th scope="col">狀態</th>
  </tr>
   </thead>
    <tbody>
 `
  let product = ''
  data.forEach(obj => {
    let container = `<tr> <th scope="row"> ${obj
      .commit} </th> <td>${obj.itemId.name}</td>
    <td>${obj.number}</td>
    <td>${obj.createAt}</td>
    <td>${obj.userId.name}</td>
     <td>未結案</td>
    </tr>
    `
    product += container
    return product
  })
  const comtentFooter = `</tbody>
</table>`
  const totalContent = contentTitle + product + comtentFooter
  return totalContent
}

document.querySelector('.shoppingList').innerHTML = list(buyItemId)