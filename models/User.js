const mongoose = require("mongoose"); //mongoose 모듈 가져오기
const bcrypt = require("bcrypt");
// generate salt
const saltRounds = 10;

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

userSchema.pre("save", function (next) {
  var user = this;
  // 비밀번호를 바꿀때만 변경되도록 설정
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
  // 비밀번호 암호화
});

// 스키마를 감싸는 모델
const User = mongoose.model("User", userSchema);

// 다른 파일에서도 사용할 수 있게 export
module.exports = { User };
