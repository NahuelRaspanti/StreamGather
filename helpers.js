const mongoose = require('mongoose');

const User = mongoose.model('user');

module.exports =  {

findUser = (userId) => {
    User.findOne(userId)
    .then(user => {
        return doc
    })
}


}