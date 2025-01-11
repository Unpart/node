function checkLogin(요청, 응답, next) {
  if (!요청.user) {
    응답.send('로그인하세요')
    응답.redirect('/login')
  }
  next()
}