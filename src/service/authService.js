const bcrypt = require('bcrypt')
const DBService = require('./dbService')

class AuthService
{
    static normalizeHash(hash){
        return hash.replace(/^\$2y\$/, '$2a$')
    }

    static auth(hash_id, password, callback){
        DBService.getPasswordHash(hash_id, (err, storePassword)=>{
            if(err){
                return callback(err)
            }

            if(!storePassword){
                return callback(null, false)
            }

            storePassword = this.normalizeHash(storePassword)
            bcrypt.compare(password, storePassword, (err, isMatch)=>{
                if(err){
                    return callback(err)
                }

                callback(null, isMatch)
            })
        })
    }
}

module.exports = AuthService