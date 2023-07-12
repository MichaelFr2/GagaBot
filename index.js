const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const token = '6354939209:AAGv1LRaR3b9bCcp6MVkV2sc_Yz98WACFCw';
const webAppUrl = 'https://silver-caramel-59fea7.netlify.app/';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text=msg.text;

    if (text === '/cv') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + 'form'}}]
                ]
            }
        })
    }
    if (text === '/fly') {
        await bot.sendMessage(chatId, 'Лети к работе мечты по кнопке ниже:', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Хочу в Европу!', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }
  if(msg?.web_app_data?.data) {
    try {
        console.log('ffff');
        const data = JSON.parse(msg?.web_app_data?.data);
        console.log(data);
        await bot.sendMessage(chatId, data?.name + ', спасибо за ваш отклик на позицию '+ data?.position);
        setTimeout( async () => {
            await bot.sendMessage(chatId, 'Всю дальнейшую информацию вы получите в этом чате: ');
        }, 3000)
    } catch (e) {
        console.log(e);
    }
}
});

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT))