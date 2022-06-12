# labManangerSystem

實驗室溶劑、耗材管理系統

概述:
統計圖依據分類，統計出日/週/月/年的平均值、最大值、最小值，並繪製成折線圖。 
毒化物領用會自動發信通知毒化物管理員確認使用狀況。

畫面渲染:
<ul>
<li>
登入頁面/最新動態
    <div >
    <img src="https://user-images.githubusercontent.com/88585009/169865248-9b3a2be2-64ba-40cf-882c-f6b0ef69217b.png" style="width:70%;"alt="登入畫面">
        
   <img src="https://user-images.githubusercontent.com/88585009/173250410-59bd202d-da81-45a0-b06a-45e1b63462e4.png" style="width:70%;" alt="最新動態">
    </div>
</li>
    <li>
分類     
    <div >
    <img src="https://user-images.githubusercontent.com/88585009/173250420-8a3c4a1a-bec3-4ad4-8e7b-68f0c74dbfca.png" style="width:70%;"alt="一般溶劑頁面">
    </div>
</li>
        <li>
統計圖
    <div >
    <img src="https://user-images.githubusercontent.com/88585009/173250189-2eaa6cec-975e-4c0d-abd4-6042d340712d.png" style="width:70%;"alt="統計圖">
    </div>
</li>
    <li>
後台    
    <div >
    <img src="https://user-images.githubusercontent.com/88585009/173250439-e2b8d8d8-3413-433e-b945-73e0903c73fa.png" style="width:70%;"alt="後台">
    </div>
</li>
    <li>


</li>
</ul>


環境建置與需求 (prerequisites)
<ul>
<li>
    "express": "^4.17.2"
    </li>
    <li>
    "express-handlebars": "^6.0.2"
     </li>
    <li>
    "method-override": "^3.0.0"
     </li>
    <li>
    "mongoose": "^6.2.1"
     </li>
    <li>
    "nodemon": "^2.0.15"
</li>
<li>
  "express-session": "^1.17.2"
</li>
 <li>
資料庫使用:mongodb
    </li>
</ul>

安裝與執行步驟 (installation and execution)
<ul>
<li>
$git clone https://github.com/changpusheng/labManangerSystem.git
</li>
<li>
$git cd  labManagerSystem/
</li>
<li>
$npm init -y
</li>
<li>
$npm install i
</li>
<li>
$npm run dev
</li>
<li>
看到 
This server is running on http://localhost:3000.
mongoose connected!
代表伺服器和資料庫連線成功!!
</li>
</ul>
功能描述 (features)
<ul>
<li>
帳號登入/登出
</li>
<li>
領用/入庫/購買/追蹤存量/確認訂單/自動發信通知
</li>
 <li>
統計圖 提供 日/週/月/年線圖做切換 圖表註釋 最大值/最小值/平均值
</li>
</ul>
