const { Schema, model } = require("mongoose");

module.exports = model("TicketConfig", new Schema({
    Guild: String,
  
    Emoji: String,
    Message: String,
    Channel: String,
    Active: Boolean,
    Category: String
}));
