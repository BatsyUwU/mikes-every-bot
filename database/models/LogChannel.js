const mongoose = require("mongoose");
const LogChannelSchema = new mongoose.Schema({
    Channel: String,
    Guild: String
});
module.exports = mongoose.model("logschannel", LogChannelSchema)