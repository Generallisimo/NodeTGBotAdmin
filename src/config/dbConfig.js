const mysql = require('mysql2')


const connect = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'ExchangeBoard'
})

connect.connect((err)=>{
    if (err) {
        console.error('Ошибка подключения к БД: ', err.message);
    } else {
        console.log('Подключено к БД');
    }
})

module.exports = connect