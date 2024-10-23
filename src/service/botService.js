const TelegramBot = require('node-telegram-bot-api')

const MessageBot = require('./bot/message')
const AxiosBot = require('./bot/axios')
const CallbackBot = require('./bot/callback')


class BotService
{
    constructor(token){
        this.bot = new TelegramBot(token, {polling:true})
        this.apiUrl = process.env.LARAVEL_API_URL
        this.userState = {hash_id: "rAVrIA9idVyz"} 

        this.axiosBot = new AxiosBot()
        this.axiosBot.apiUrl = this.apiUrl

        this.messageBot = new MessageBot()
        this.messageBot.bot = this.bot
        this.messageBot.userState = this.userState
        this.messageBot.axiosBot = this.axiosBot

        this.callbackBot = new CallbackBot(this.bot, this.axiosBot, this.userState)

    }

    app(){
        this.bot.setMyCommands([
            {command: '/start', description: 'Главное меню'},
            {command: '/auth', description: 'Вход в аккаунт'},
            {command: '/logout', description: 'Выход из аккаунта'},
        ])
        
        this.bot.on('message', (msg)=>{
            this.messageBot.message(msg)
        })

        this.bot.on('callback_query', (msg)=>{
            this.callbackBot.buttons(msg)
        })
    }

}
 
module.exports = BotService 