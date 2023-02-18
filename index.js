const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const config = require("./config/key");
const { User } = require("./models/User");

// application/x-www-form-urlencode 를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입을 분석해서 가져올 수 있게  함
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDV Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello nodemon!");
});

app.post("/register", (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body);
  // save하기 전에 비밀번호 암호화

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/login',(req,res)=>{
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다
  // 요청된 이메일이 데이터베스 있다면 비밀번호가 올바른 비밀번호인지 확ㅣ
  // 비밀번호까지 맞다면 토큰을 생성하기
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
