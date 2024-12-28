const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override')

app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

let db;
const url = 'mongodb+srv://admin:lojKpBMQj180JP3k@cluster0.b2rvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // 내 몽고DB 주소 
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
  let result = await db.collection('post').find().toArray() // await은 바로 다음줄을 실행하지 말고 잠깐 기다려 달라는 뜻이다.
  응답.render('list.ejs', { posts : result })
})

app.get('/time', async (요청, 응답) => {
  응답.render('time.ejs', { time : new Date()})
}) 

app.get('/write', (요청, 응답) => {
  응답.render('write.ejs')
}) 

app.post('/add', async (요청, 응답) => {
  console.log(요청.body)
  try {
    if (요청.body.title == '' || 요청.body.content == '') {
      응답.send('입력 안했는데?')
    } else {
      await db.collection('post').insertOne({title: 요청.body.title, content: 요청.body.content})
      응답.redirect('/list')
    }
  } catch(e) {
    console.log(e)
    응답.status(500).send('서버 에러남')
  }
})

app.get('/detail/:id', async(요청, 응답) => {
  try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
    응답.render('detail.ejs', {result : result})
    if (reuslt == null) {
      응답.status(404).send('이상한 url 입력함')
    }
  } catch(e) {
    console.log(e)
    응답.status(404).send('이상한 url 입력함')
  }
})

app.get('/edit/:id', async (요청,응답) => { //:는 url 파라미터 문법
  let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
  응답.render('edit.ejs', {result : result})
})

app.put('/edit', async (요청,응답) => { //:는 url 파라미터 문법
  let result = await db.collection('post').updateOne({ _id : new ObjectId(요청.body.id) }, { $set : { title : 요청.body.title, content : 요청.body.content}})
  console.log(result)
  응답.redirect('/list')
})