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
    time: Date,
});

// 모델 생성
const Chat = mongoose.model('Chat', chatMessage);

// 데이터 생성
async function chatSave(chatDoc){
    const chatmsg = new Chat(chatDoc);
    chatmsg.save((err, result) => {
        if (err) throw err;
        console.log(result);
    });
};
// 몽구스 종료


chatSave({
    user: "user1",
    room: 'room1',
    userName: 'user1',
    message: 'hello',
    time: new Date(),
});
