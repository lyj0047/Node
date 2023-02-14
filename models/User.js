const mongoose = require("mongoose"); //mongoose 모듈 가져오기

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

// 스키마를 감싸는 모델
const User = mongoose.model("User", userSchema);

// 다른 파일에서도 사용할 수 있게 export
module.exports = { User };
