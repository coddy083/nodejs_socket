// 몽구스 연결
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb://root:1234@localhost:27017',
    {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB conected'))
  .catch((err) => {
    console.log(err);
  });

// 스키마 생성
const Schema = mongoose.Schema;
const chatMessage = new Schema({
  user: String,
  room: String,
  userName: String,
  message: String,
  time: Date
});