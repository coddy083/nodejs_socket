import mongoose from "mongoose";
const uri = 'mongodb://root:1234@mongodb:27017';
mongoose.connect(uri, {
  // useNewUrlPaser: true,
  // useUnifiedTofology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
}
)
  .then(() => console.log('***** MongoDB conected *****'))
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
  time: Date,
});

// 모델 생성
export const Chat = mongoose.model('Chat', chatMessage);

// 데이터 생성
export const chatSave = (chatDoc) => {
  const chatmsg = new Chat(chatDoc);
  chatmsg.save((err, result) => {
    if (err) throw err;
    console.log(result);
  });
}