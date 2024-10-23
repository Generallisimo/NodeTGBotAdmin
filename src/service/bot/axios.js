const axios = require('axios')

class AxiosBot
{
    // transaction
    async getTransaction(status, page) {
        try {
            const response = await axios.get(`${this.apiUrl}api/bot/transactions/${status}?page=${page}`)
            return response.data;
        } catch (error) {
            console.log('Ошибка получения транзакций:', error);
            throw error;
        }
    }

    async getTransactionID(exchange_id){
        try{
            const response = await axios.get(`${this.apiUrl}api/bot/transactions/id/${exchange_id}`) 
            return response.data
        }catch(e){
            console.log('Ошибка получения транзакции', e)
            throw e
        }
    }

    // personal

    async getPersonal(hash_id){
        try{
            const response = await axios.get(`${this.apiUrl}api/bot/personal/${hash_id}`)
            return response.data
        }catch(e){
            console.log('Ошибка получения персональных данных', e)
            throw e
        }
    }

    async getStatusMarket(hash_id){
        try{
            const response = await axios.get(`${this.apiUrl}api/bot/personal/update/${hash_id}`)
            // console.log(response)
            return response.data
        }catch(e){
            console.log('ошибка смены статуса', e)
            throw e
        }
    }
    // http://localhost:8000/api/bot/personal/wallet/update/rAVrIA9idVyz/TXxf79abGpMQieySKs23gCnneFdwMrSbA
    async getNewDetailsMarket(hash_id, details_to){
        try{
            const response = await axios.put(`${this.apiUrl}api/bot/personal/wallet/update/${hash_id}/${details_to}`)
            return response.data
        }catch(e){
            console.log('ошибка в изменение кошелька', e)
            throw e
        }
    }
}

module.exports = AxiosBot