const mongoose = require("mongoose");
const ModRoleSchema = new mongoose.Schema({
    Role: Array,
    Guild: String
});
module.exports = mongoose.model("modroles", ModRoleSchema)