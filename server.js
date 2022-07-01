const express = require('express') // 설치한 익스프레스 라이브러리 사용 할게요
const app = express(); // 익스프레스 라이브러리를 앱이란 객체로 만들게요 이해하고 쓸 필요 없다함
const mysql = require('mysql'); // 마이에스큐엘 라이브러리를 사용하겠다는 문구
// const body = require('body-parser'); // 
const bodyParser = require('body-parser'); //
const ejs = require('ejs');
const dotenv = require('dotenv');
require("dotenv").config();
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');

// const config = dotenv.parse(buf)

app.set('view engine', 'ejs');
app.set('views', './views');
const connection = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password : process.env.db_password,
    database: process.env.db_database
});
console.log(process.env.PORT)
app.use(bodyParser());
app.use(cookieParser());
app.listen(PORT, function () { // 첫번째 파라미터는 서버를 띄울 포트 넘버, 두번째는 띄운 후 실행할 함수
    console.log(PORT+'server start')
});

//npm install -g nodemon = 이걸 설치안하면 변경사항이 있을 때 마다 node server.js 를 터미널에서 타이핑해서
// 서버를 매번 컨트롤+C를 눌러서 닫고 다시 열어야 하는데 nodemon 설치 시 live server 마냥 변경사항이 저장될때마다
// 실시간으로 새로고침 됨 

// 만약 /경일게임 아카데미 로 접속하면 ~를 실행해라
app.get('/pet/beauty', function (req, res) {
    res.send ("펫 뷰티용품을 쇼핑할 수 있는 페이지 입니다.")
})
app.get('/pet', function (req, res) {
    res.send ("펫 ㄴㅇㄹㅁㅇㄴㄹㅁ뷰티용품을 쇼핑할 수 있는 페이지 입니다.")
})
app.get('/', function (req, res) { // 경로에 / 한개만 적을 경우 홈페이지 같은 개념
    console.log(req.headers.cookie)
    if (req.header.cookie !== 'undefined') { 
        res.render("signup.ejs", {
            data: 'hasCookie'
        })
    } else {
        res.render("signup.ejs", {
            data: "noCookie"
        })
    }
})

app.post('/', (req, res) => {
    //console.log(req.body.id); // req요청 중에 id라는 이름으로 보냈을 때 req.body.id에 담긴다. == 요청한 id 값 js90번째 

    

    let dbdb = {}
    dbdb[process.env.dbID] = req.body.id;
    console.log(dbdb);
    let query1 = process.env.db_queryidFIRST +"'" + req.body.id + "';"
    connection.query(query1, (err, result) => { // 위 쿼리문 실행시 나오는 결과값이 result에 담김
        if (err) console.log(err);
        else {
            console.log('쿼리문 정상작동') //sql 문구가 에러 없이 정상 작동함
            if (result[0] == undefined) {
                console.log(result)
                res.send('usable')
            } else {
                console.log('사용자 있음 다른 아이디 사용하셈')
                res.send('disusable')
            }
        }
        
    })
})
app.post('/signUpPro', (req, res) => {
    // insert into members (id,pw,name,phone,birth) values ("rudghks09",rudghks110,kim,phone,birth);
    // const addId =
    //     'insert into members (id,pw,name,phone,birth) values ("' + req.body.hiddenId + '", "' + req.body.password + '", "' + req.body.name + '", "' + req.body.phoneNum + '", "' + req.body.birth + '");'
    let dbdb = {}
    dbdb[process.env.dbID] = req.body.hiddenId;
    dbdb[process.env.dbPW] = req.body.password;
    dbdb[process.env.dbNAME] = req.body.name;
    dbdb[process.env.dbPHONE] = req.body.phoneNum;
    dbdb[process.env.dbPHONE] = req.body.birth;
    // dbdb 객체에 [키값] = 밸류값 으로 들어감
    console.log(dbdb);
    connection.query(process.env.db_signupquery, dbdb, (err, result) => {
        if (err) console.log(asdf);
        else {
            console.log('가입성공');
            res.redirect('/login');

        }
        
    })

})

app.get('/login', (req, res) => {
    const signupid = "select * from members order by registDate desc;"
    
    connection.query(signupid, (err, result) => {
        if (err) console.log('err');
        else {
            res.render(("login.ejs"), {
                data: result[0]
            });
        }
    })
})

app.post('/login', (req, res) => {
    console.log(req.body.id);
    console.log(req.body.pw);
    //                  select id,pw from members where id = "a or 1=1 --" and pw = "req.body.password'
    const logincheck = process.env.db_loginquery + req.body.id + process.env.db_loginquery2 + req.body.pw + '";'
    connection.query(logincheck, (err, result) => {
        if (err) console.log('error')
        else {
            console.log('query suc')
            if (result[0] === undefined) {
                console.log(result)
                console.log("none ID")
                res.send('loginfail')
                // res.redirect('/login');
            }
            else {
                console.log('login suc')
                res.cookie('user', req.body.id, { // user 라는 이름 및 req.body.id 라는 값을 가진 쿠키 발급 중괄호 안은 속성 부여
                    httpOnly: true, // 자바 스크립트에서 document.cookie 시 확인되지 않음
                    expires: new Date(Date.now() + 1000*60*60) // 쿠키 발급 후 얼마나 쿠키를 가지고 있을 지
                })
                res.send('loginsuc')
            }
        }
    })
})
