const keyboardOptions = require('./keyboardOptions')

class CallbackBot
{
    constructor(bot, axiosBot, userState){
        this.bot = bot
        this.axiosBot = axiosBot
        this.userState = userState
        this.keyboardOptions = keyboardOptions
    }

    // oop transaction 

    async transactionButton(chatID, status, page = 1){
        const transactionSuccess = await this.axiosBot.getTransaction(status, page);
            
        const buttons = transactionSuccess.data.map(t => [{ text: `${t.exchange_id}`, callback_data: `transaction_${t.exchange_id}` }]);
    
        const navigationButtons = [];

        if (transactionSuccess.meta.current_page > 1) {
            navigationButtons.push({ text: '⬅️ Предыдущая', callback_data: `page_${status}_${page - 1}` });
        }
    
        if (transactionSuccess.meta.current_page < transactionSuccess.meta.last_page) {
            navigationButtons.push({ text: 'Следующая ➡️', callback_data: `page_${status}_${page + 1}` });
        }

         await this.bot.sendMessage(
            chatID,
            `Ваши транзакции: страница ${page}`, 
            {
                reply_markup: {
                    inline_keyboard: [
                        ...buttons,
                        navigationButtons,
                        [{ text: 'Назад', callback_data: 'backTransactionMenu' }] // кнопка назад
                    ]
                }
            }
        );
    }



    async buttons(msg){
        const message = msg.data
        const chatID = msg.message.chat.id

        // const messageID = msg.message.message_id;
        // await this.bot.deleteMessage(chatID, messageID);

        // transactions

        if (message === 'transaction' || message === 'backTransactionMenu'){
            return this.bot.sendMessage(chatID, 'Здесь вы можете увидеть ваши транзакции по категориям', this.keyboardOptions.transactionOptions())
        }
        
        if (message === 'success') {
            return await this.transactionButton(chatID, 'success')
        }
        
        if (message === 'await') {
            return await this.transactionButton(chatID, 'await')
        }
        
        if (message === 'to_success') {
            return await this.transactionButton(chatID, 'to_success')
        }
        
        if (message === 'error') {
            return await this.transactionButton(chatID, 'error')
        }
        
        if (message === 'fraud') {
            return await this.transactionButton(chatID, 'fraud')
        }
        
        if (message === 'archive') {
            return await this.transactionButton(chatID, 'archive')
        }
        
        if (message === 'dispute') {
            return await this.transactionButton(chatID, 'dispute')
        }

        if (message.startsWith('page_')) {
    
            const [_, status, page] = message.split('_');
            const pageNumber = parseInt(page, 10);

            return await this.transactionButton(chatID, status, pageNumber);

        }

        // two step with transaction

        if(message.startsWith('transaction_')){
            const exchange_id = message.split('_')[1]
            console.log(exchange_id)

            const exchange = await this.axiosBot.getTransactionID(exchange_id)
            console.log(exchange)

            return await this.bot.sendMessage(chatID, 
                `Здесь все данные о транзакции\n ID Транзакции:${exchange.exchange_id}\n Сумма получения: ${exchange.amount_users}`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Успешно", callback_data: "success_await"}, {text: "Архив", callback_data: "archive_await"}],
                            [{text: "Диспут", callback_data: "dispute_await"}, {text: "Мошенник", callback_data: "fraud_await"}],
                            [{text: "Назад", callback_data: "backTransactionMenu"}],
                        ]
                    }
                }
            )
        }
        
        if(message.startsWith('transactionDispute_')){
            const exchange_id = message.split('_')[1]
            console.log(exchange_id)

            const exchange = await this.axiosBot.getTransactionID(exchange_id)
            console.log(exchange)

            return await this.bot.sendMessage(chatID, 
                `Здесь все данные о транзакции\n ID Транзакции:${exchange.exchange_id}\n Сумма получения: ${exchange.amount_users}`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Успешно", callback_data: "success_dispute"}, {text: "Мошенник", callback_data: "fraud_dispute"}],
                            [{text: "Назад", callback_data: "backTransactionMenu"}],
                        ]
                    }
                }
            )
        }
        
        if(message.startsWith('transactionAnother_')){
            const exchange_id = message.split('_')[1]
            console.log(exchange_id)

            const exchange = await this.axiosBot.getTransactionID(exchange_id)
            console.log(exchange)

            return await this.bot.sendMessage(chatID, 
                `Здесь все данные о транзакции\n ID Транзакции:${exchange.exchange_id}\n Сумма получения: ${exchange.amount_users}`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Назад", callback_data: "backTransactionMenu"}],
                        ]
                    }
                }
            )
        }
        

        // personal
        
        //change userState response on [chatID]
        // const personal = await this.axiosBot.getPersonal(this.userState.hash_id);

        if (message === 'personal' || message === 'backPersonalMenu'){

            const personal = await this.axiosBot.getPersonal(this.userState.hash_id);

            // console.log(personal)
            await this.bot.sendMessage(
                chatID,
                `Ваш ID: ${personal.account.hash_id}\nВаш статус аккаунта: ${personal.account.status}\nВаш баланс: ${personal.account.balance}`,
                this.keyboardOptions.personalOptions()
            )
        }

        if(message === 'statusMarket'){

            const personal = await this.axiosBot.getPersonal(this.userState.hash_id);

            const statusMarket = await this.axiosBot.getStatusMarket(this.userState.hash_id)
            // console.log(statusMarket)
            await this.bot.sendMessage(
                chatID,
                `Ваш ID: ${personal.account.hash_id}\nВаш статус аккаунта: ${personal.account.status}\nВаш баланс: ${personal.account.balance}`,
                this.keyboardOptions.personalOptions()
            )
        }

        if (message === 'topUp'){
            const personal = await this.axiosBot.getPersonal(this.userState.hash_id);

            return this.bot.sendMessage(chatID, `Здесь вы можете пополнить баланс\nКошелек:${personal.account.details_from}\nUSDT TRC 20 `, this.keyboardOptions.topUpOptions())
        }

        if( message === 'withdrawal' || message === 'backPersonalMenuWithdrawal'){
            const personal = await this.axiosBot.getPersonal(this.userState.hash_id);

            return this.bot.sendMessage(chatID, `Здесь вы можете работать вывести деньги\nБaланас: ${personal.account.balance}\nКошелек: ${personal.account.details_to}\nКоммисия: 5 долларов `, this.keyboardOptions.withdrawalOptions())
        }

        if(message === 'updateDetailsWithdrawal'){
            this.userState[chatID] = {userMessage: "awaitNewDetails"}
            return this.bot.sendMessage(
                chatID,
                'Введите кошелек на который хотите заменить',
                {
                    reply_markup:{
                        inline_keyboard:[
                            [{text: "Назад", callback_data:"backPersonalMenuWithdrawal"}]
                        ]
                    }
                }
            )
        }
        


        if (message === 'details' || message === 'backDetailsMenu'){
            const personal = await this.axiosBot.getPersonal(this.userState.hash_id);

            const details = personal.details_account.map(d => [{text:`${d.details_market_to}`, callback_data: `details_1`}])
            return this.bot.sendMessage(
                chatID, 
                'Здесь вы можете увидеть ваши реквизиты для оплаты',
                {
                    reply_markup:{
                        inline_keyboard:[
                            ...details,
                            [{text: "Добавить", callback_data: "addDetails"}],
                            [{text: "Назад", callback_data: "backMainMenu"}],
                        ]
                    }
                }
            )
        }
        
        if (message === 'details_1'){
            return this.bot.sendMessage(chatID, 'Здесь вы можете изменить статус карты либо удалить её', this.keyboardOptions.detailsUpdateOptions())
        }

        if (message === 'addDetails'){
            return this.bot.sendMessage(chatID, `Здесь вы можете добавить к этим методам свои реквизиты `, this.keyboardOptions.detailsAddOptions())
        }

        if( message === 'backMainMenu'){
            return this.bot.sendMessage(chatID, `Главное меню `, this.keyboardOptions.startOptions())
        }

        // return await bot.sendMessage(chatID, `Ты выбрал категорию ${message}`)
    }


}

module.exports = CallbackBot











    // async transactionDisputeButton(chatID, status){
    //     const transactionSuccess = await this.axiosBot.getTransaction(status);
    //     console.log(status)
    //     const buttons = transactionSuccess.map(t => [{ text: `${t.exchange_id}`, callback_data: `transactionDispute_${t.exchange_id}` }]);
    //     // console.log(buttons)
    //      await this.bot.sendMessage(
    //         chatID,
    //         `Ваши транзакции  выполненые:`, 
    //         {
    //             reply_markup: { 
    //                 inline_keyboard: [
    //                     ...buttons,
    //                     [{ text: 'Назад', callback_data: 'backTransactionMenu' }]
    //                 ]
    //             }
    //         }
    //     );
    // }
    
    // async transactionAnotherButton(chatID, status){
    //     const transactionSuccess = await this.axiosBot.getTransaction(status);
    //     // console.log(transactionSuccess)
    //     console.log(status)
    //     const buttons = transactionSuccess.map(t => [{ text: `${t.exchange_id}`, callback_data: `transactionAnother_${t.exchange_id}` }]);
    //     // console.log(buttons)
    //      await this.bot.sendMessage(
    //         chatID,
    //         `Ваши транзакции  выполненые:`, 
    //         {
    //             reply_markup: { 
    //                 inline_keyboard: [
    //                     ...buttons,
    //                     [{ text: 'Назад', callback_data: 'backTransactionMenu' }]
    //                 ]
    //             }
    //         }
    //     );
    // }