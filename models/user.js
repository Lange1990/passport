const db = require("../db");
const S = require("sequelize");
const crypto = require("crypto");


class User extends S.Model {}

User.init ({

    username: {
        type: S.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: S.STRING
    },

    salt: {
        type: S.STRING
    }
}, {sequelize: db, modelName: "user"})

User.addHook("beforeCreate", (user)=>{
    user.salt = crypto.randomBytes(20).toString("base64")
    user.password = user.createHash(user.password)
})

User.prototype.createHash = function (password){
    return crypto.createHmac("sha256", this.salt).update(password).digest("base64")
}

User.prototype.validatePassword = function (password){
    return this.password === this.createHash(password)
}


module.exports = User