const mongoose = require("mongoose");

const GiveawaySchema = new mongoose.Schema({
    guildId: { type: String, required: true},
    messageId: { type: String, required: true},
    channelId: { type: String, required: true},
    title: { type: String, required: true},
    prize: { type: String, required: true},
    winners: { type: Number, required: true},
    createdOn: { type: Date, required: true},
    endsOn: { type: Date, required: true},
    isNewGiveaway: { type: Boolean, required: true},
    edited: { type: Boolean, required: true},
    duration: { type: String, required: true},
    host: {type: String, required: true},
    serverar: Array,
    rolereqs: mongoose.Schema.Types.Mixed,
    serverreqs: mongoose.Schema.Types.Mixed,
    Resolved: Boolean
});

const Giveaway = module.exports = mongoose.model(`Giveaway`, GiveawaySchema);