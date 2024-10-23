module.exports = {
    startOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Транзакции", callback_data: "transaction"},{text: "Реквизиты", callback_data: "details"}],
                        [{text: "Личный кабинет", callback_data: "personal"}],
                    ]
                }
            }
        },

    transactionOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Ожидают", callback_data: "await"}],
                        [{text: "Успешные", callback_data: "success"}, {text: "В обработке", callback_data: "to_success"}],
                        [{text: "Архив", callback_data: "archive"}, {text: "Диспуты", callback_data: "dispute"}],
                        [{text: "Ошибка", callback_data: "error"}, {text: "Мошенники", callback_data: "fraud"}],
                        [{text: "Назад", callback_data: "backMainMenu"}],
                    ]
                }
            }
    },
    
    // transactionShowOptions(){
    //     return{
    //             reply_markup:{
    //                 inline_keyboard:[
    //                 ]
    //             }
    //         }
    // },


    // detailsOptions(){
    //     return{
    //             reply_markup:{
    //                 inline_keyboard:[
    //                     [{text: "Добавить", callback_data: "addDetails"}],
    //                     [{text: "Sber 89031412139", callback_data: "details_1"}],
    //                     [{text: "Назад", callback_data: "backMainMenu"}],
    //                 ]
    //             }
    //         }
    //     },

    detailsUpdateOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Изменить статус карты", callback_data: "statusDetails"}],
                        [{text: "Изменить карту", callback_data: "updateDetailsPay"}, {text: "Удалить", callback_data: "delete"}],
                        [{text: "Назад", callback_data: "backDetailsMenu"}],
                    ]
                }
            }
    },

    detailsAddOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Sberbank", callback_data: "sberbank"}, {text: "Tinkoff", callback_data: "tinkoff"}],
                        [{text: "Raiffeisen", callback_data: "raiffeisen"}, {text: "Alfa", callback_data: "afla"}],
                        [{text: "Private24", callback_data: "private24"}, {text: "Monobank", callback_data: "monobank"}],
                        [{text: "Назад", callback_data: "backDetailsMenu"}],
                    ]
                }
            }
        },

    personalOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Изменить свой статус", callback_data: "statusMarket"}],
                        [{text: "Пополнение", callback_data: "topUp"}, {text: "Вывод", callback_data: "withdrawal"}],
                        [{text: "Назад", callback_data: "backMainMenu"}],
                    ]
                }
            }
        },

    topUpOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Пополнил", callback_data: "updateTopUp"}],
                        [{text: "Назад", callback_data: "backPersonalMenu"}],
                    ]
                }
            }
        },

    withdrawalOptions(){
        return{
                reply_markup:{
                    inline_keyboard:[
                        [{text: "Вывести", callback_data: "updateWithdrawal"}],
                        [{text: "Изменить кошелек", callback_data: "updateDetailsWithdrawal"}],
                        [{text: "Назад", callback_data: "backPersonalMenu"}],
                    ]
                }
            }
        }
}