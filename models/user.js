const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    twitchId:  Number,
    mixerId: Number,
    twitchAccess: String,
    mixerAccess: String,
    twitchRefresh: String,
    mixerRefresh: String
  });

mongoose.model('user', userSchema);