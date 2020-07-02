const { model, Schema } = require('mongoose');
module.exports= model('suggestion-channels', new Schema({
    Guild: String,
    Channel: String,
    AcceptEmoji: String,
    DenyEmoji: String
}))