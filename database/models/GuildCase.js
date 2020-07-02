const { Schema, model } = require("mongoose");
module.exports = model("GuildCase", new Schema({
    Guild: String,
    CaseID: Number,
    Punishment: String,
    User: Object,
    Moderator: Object,
    Date: Date,
    Reason: String,
    Appealed: Boolean,
    isDeniedAppeal: Boolean,
    Appeal: Object,
    UserID: String
    
}));