const AuthService = require('../authService')
const AxiosBot = require('./axios')
const keyboardOptions = require('./keyboardOptions')

class MessageBot 
{
    constructor(){
        this.keyboardOptions = keyboardOptions
    }

    async message(msg){
        const message = msg.text
        const chatID = msg.chat.id
        const messageID = msg.message_id

        // удаление сообщение
        // setTimeout(()=> {
        //     this.bot.deleteMessage(chatID, messageID)
        // }, 10000)
    
        if(message === '/auth'){
            this.userState[chatID] = {step: 'awaitLogin'}
            const botMessage = await this.bot.sendMessage(chatID, 'Введите свой Hash ID')
            // setTimeout(() => {
            //     this.bot.deleteMessage(chatID, botMessage.message_id)
            // }, 10000);
            console.log(botMessage)
            return
        }

        if(this.userState[chatID]?.step === 'awaitLogin'){
            this.userState[chatID].hash_id = message
            this.userState[chatID].step = 'awaitPassword'
            const botMessage = await this.bot.sendMessage(chatID, 'Введите свой пароль')
            // setTimeout(() => {
            //     this.bot.deleteMessage(chatID, botMessage.message_id)
            // }, 10000);
            return
        }

        if(this.userState[chatID]?.step === 'awaitPassword'){
            const hash_id = this.userState[chatID].hash_id
            const password = message.trim()

            AuthService.auth(hash_id, password, (err, isAuth)=>{
                if(err){
                    console.log(err)
                    const botMessage = this.bot.sendMessage(chatID, 'Обратитесь в тех поддержку, произошла ошибка')
                    // setTimeout(() => {
                    //     this.bot.deleteMessage(chatID, botMessage.message_id)
                    // }, 100000);
                    return 
                }
                
                if(isAuth){
                    this.userState[chatID].isAuthenticated = true
                    this.userState[chatID].step = null
                    const botMessage = this.bot.sendMessage(chatID, `Приветствую, добро пожаловать в личный кабинет ${hash_id}`, this.startOptions())
                    // setTimeout(()=>{
                    //     this.bot.deleteMessage(chatID, botMessage.message_id)
                    // }, 10000)
                    return
                }else{
                    this.userState[chatID].step = 'awaitLogin';
                    const botMessage = this.bot.sendMessage(chatID, 'Такого пользователя не существует, попробуйте заново')
                    // setTimeout(() => {
                    //     this.bot.deleteMessage(chatID, botMessage.message_id)
                    // }, 10000);
                    return
                }
            })
        }

        if(message === '/logout'){
            delete this.userState[chatID]
            const botMessage = await this.bot.sendMessage(chatID, 'Вы успешно вышли из системы')
            // setTimeout(() => {
            //     this.bot.deleteMessage(chatID, botMessage.message_id)
            // }, 10000);
            return
        }

        if(message === '/start'){
            if (this.userState[chatID]?.isAuthenticated) {
                const botMessage = await this.bot.sendMessage(chatID, `Главное имя`, this.keyboardOptions.startOptions());
                // setTimeout(() => {
                //     this.bot.deleteMessage(chatID, botMessage.message_id)
                // }, 10000);
                return
            } else {
                await this.bot.sendMessage(chatID, 'Это бот который поможет вам взаимодействовать с вашим сервисом!')
                const botMessage = await this.bot.sendMessage(chatID, `Привет! Пожалуйста, войдите в систему.`);
                // setTimeout(() => {
                //     this.bot.deleteMessage(chatID, botMessage.message_id)
                // }, 10000);
                return
            }
        }

        if(this.userState[chatID].userMessage === 'awaitNewDetails'){
            console.log(this.userState.hash_id)
            this.userState[chatID].userMessage = message 
            console.log(this.userState[chatID].userMessage)
            const result = await this.axiosBot.getNewDetailsMarket(this.userState.hash_id, this.userState[chatID].userMessage)
            console.log(result)
            delete this.userState[chatID].userMessage
            await this.bot.sendMessage(chatID, 'Кошелек успешно обнавлен', this.keyboardOptions.startOptions())
        }

    }  
}

module.exports = MessageBot