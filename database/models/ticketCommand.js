const { Schema, model } = require("mongoose");
module.exports = model("ticket", new Schema({
    Guild: String,
    CloseMessage: String,
    Channel: String,
    Category: String,
    User: String,
    Resolved: Boolean
    
}));