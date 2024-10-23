const db = require('../config/dbConfig')

class DBService
{
    static getPasswordHash(hash_id, callback){
        const query = 'SELECT password FROM users WHERE hash_id = ?'

        db.query(query, [hash_id], (err, result)=>{
            if(err){
                return callback(err)
            }

            if(result.length === 0){
                return callback(null, false)
            }

            callback(null, result[0].password)
        })
    }
}

module.exports = DBService