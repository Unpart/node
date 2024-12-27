const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const { MongoClient } = require('mongodb');

let db;
const url = 'mongodb+srv://admin:lojKpBMQj180JP3k@cluster0.b2rvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; /** 내 몽고DB 주소 */
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum');
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})

app.get('/', (요청, 응답) => {
  응답.sendFile(__dirname + '/index.html')
}) 

app.get('/news', (요청, 응답) => {
  응답.send('오늘 비옴')
}) 

app.get('/shop', (요청, 응답) => {
  응답.send('쇼핑페이지임')
}) 

app.get('/about', (요청,응답) => {
  응답.sendFile(__dirname + '/about.html')
})

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray() /** await은 바로 다음줄을 실행하지 말고 잠깐 기다려 달라는 뜻이다. */
  응답.render('list.ejs', { posts : result })
})

app.get('/time', async (요청, 응답) => {
  응답.render('time.ejs', { time : new Date()})
}) 