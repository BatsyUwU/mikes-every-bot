const { Schema, model } = require("mongoose");
module.exports = model("GuildPrefix", new Schema({
    Guild: String,
    Prefix: String
    
}));