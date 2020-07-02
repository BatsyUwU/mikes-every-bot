const Discord = require("discord.js");
const db = require("quick.db")
const {
    MessageEmbed,
    WebhookClient,
    Util,
    Collection
} = require("discord.js");
const modRoleSchema = require("../../database/models/ModRole");
const GuildPrefix = require("../../database/models/GuildPrefix")
module.exports = {
    name: "setprefix",
    aliases: ['prefix', 'chprefix', 'changeprefix', 'set-prefix'],
    description: "Change the current prefix for your guild!",
    usage: `[p]setprefix <new prefix>`,
    category: "configuration",
    timeout: 10000,
    run: async(bot, message, args) =>{
        const prefix = bot.guildPrefixes.get(message.guild.id)
        console.log(this.name + " was used");
        const modRole = await modRoleSchema.findOne({ Guild: message.guild.id}) || message.guild.roles.highest;
        if(!args[0]) return message.channel.send(`My current prefix here is \`${prefix}\`.\nTo get started type \`${prefix}help\`!`);
    
        if(args[0].startsWith(`<@${bot.user.id}>`) || args[0].startsWith(`<@!${bot.user.id}>`)) return message.channel.send(`I already have a mentionable prefix no need to set it to that!`);
        if(args[0].length >= 10) return message.channel.send(`The prefix must be under 10 characters!`);
        GuildPrefix.findOne({ Guild: message.guild.id}, async(err, data) =>{
            if(err) throw err;
            
                data.Prefix = args[0].toLowerCase();
            data.save();
            let updatedPrefix = {
                textChannel: message.channel,
                guild: message.guild,
                prefix: args[0].toLowerCase()
            }
            bot.emit("prefixUpdate", updatedPrefix)
            
            bot.guildPrefixes.set(message.guild.id, args[0]);
            
            
        })
    }
}