const GuildCase = require("../../database/models/GuildCase.js");
const Discord = require("discord.js");
const db = require("quick.db")
const {
    MessageEmbed,
    WebhookClient,
    
    Collection
} = require("discord.js");
const { stripIndents } = require("common-tags");
const Util = require("../../utils/Util");
const modRoleSchema = require("../../database/models/ModRole");
module.exports = {
    name: "appeal",
    aliases: ['case-appeal'],
    description: "Appeal a case!",
    usage: `[p]appeal <case id> <reason>`,
    category: "moderation",
    timeout: 10000,
    run: async(bot, message, args) =>{
        const prefix = bot.guildPrefixes.get(message.guild.id)
        console.log(this.name + " was used");
        const modRole = await modRoleSchema.findOne({ Guild: message.guild.id}) || message.guild.roles.highest;
        if(!args[0]) return message.channel.send("Please specify a case id!");
        if(args[0]){
            try{
                let CaseID = args[0];
                let reason = args.slice(1).join(" ")
                if(!args[1]) reason = "No reason provided";
                await message.channel.send(`Please enable your dms to get started! I will inform you whenver you get accepted.`)
                require("../../events/CustomEvents/appealCase")(bot, message.guild, message.author, CaseID, reason )
            }catch(err){
                console.log(err)
            }

        }
    
    }
}