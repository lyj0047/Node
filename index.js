const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const { User } = require("./models/User");

// application/x-www-form-urlencode 타입의 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입의 데이터를 분석해서 가져올 수 있게  함
app.use(bodyParser.json());

app.use(cookieParser());

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
      // 200: 성공
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 이메일이 데이터베스 있다면 비밀번호가 올바른 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
    });

    // 비밀번호까지 맞다면 토큰을 생성하기
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err); // 400: err
      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userID: user._id });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
