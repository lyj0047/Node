const mongoose = require("mongoose"); //mongoose 모듈 가져오기
const bcrypt = require("bcrypt");
// generate salt
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 공백을 없애줌(예: john ahn@naver.com ),
    unique: 1, // 중복 불가
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    // 관리자와 일반 유저 분리
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    // 유효성 관리
    type: String,
  },
  tokenExp: {
    // 토큰 유효기간
    type: Number,
  },
});

// save전에 function을 하겠다
userSchema.pre("save", function (next) {
  var user = this;
  // 비밀번호를 바꿀때만 변경되도록 설정
  if (user.isModified("password")) {    // isModified는 mongoose 모듈에 포함되어있는 함수. 파라미터로 들어온 값이 db에 기록된 값과 비교해서 변경된 경우에는 true를, 그렇지 않은 경우는 false를 반환하는 함수
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
  // 비밀번호 암호화
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err), cb(null, isMatch);   // err==null, isMatch==true
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken을 이용해서 토큰을 생성하기
  var token = jwt.sign(user._id, "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user); // 에러는 없고 user정보 전달
  });
};

// 스키마를 감싸는 모델
const User = mongoose.model("User", userSchema);

// 다른 파일에서도 사용할 수 있게 export
module.exports = { User };
