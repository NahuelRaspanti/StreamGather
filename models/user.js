const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    twitchId:  { type: Number, default: ''},
    mixerId: { type: Number, default: ''},
    twitchAccess: { type: String, default: ''},
    mixerAccess: { type: String, default: ''},
    twitchRefresh: { type: String, default: ''},
    mixerRefresh: { type: String, default: ''}
  });

module.exports = userSchema