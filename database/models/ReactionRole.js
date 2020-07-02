const { Schema, model } = require('mongoose');

module.exports= model('reaction-roles', new Schema({
    Guild: String,
    Role: String,
    Emoji: String,
    Message: String,
    Channel: String,
    Active: Boolean,
    RemoveRole: Boolean
}));