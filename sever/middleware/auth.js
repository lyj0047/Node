const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리

  // client cookie에서 token 가져오기
  let token = req.cookies.x_auth;

  // token을 JWT로 복호화한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true }); // user가 없으면
    // user 있으면
    req.token = token;
    req.user = user;
    // index에서 사용하기 위해 req.token, req.user를 넣어줌
    
    next();
  });
  // 유저가 있으면 인증 Okay
  // 유저가 없으면 인증 No
};

module.exports = { auth };
