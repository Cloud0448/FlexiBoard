const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 제공 설정
app.use(express.static('public'));

// 'views' 폴더를 정적 파일을 제공하는 경로로 설정
//app.use(express.static(path.join(__dirname, 'views')));

// 기본 경로에 대해 'index.html' 파일을 보냄
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// 서버를 3000번 포트에서 실행합니다.
app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});