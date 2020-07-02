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
    name: "kick",
    aliases: ['k', 'ki'],
    description: 'Kick a user from the server.',
    usage: '[p]kick <@mention | id | tag> <reason>',
    category: 'moderation',




    run: async(bot, message, args) => {
       const prefix = bot.guildPrefixes.get(message.guild.id);
       let modRoles = await modRoleSchema.findOne({ Guild: message.guild.id});
       let modRole;
       if(!modRoles) modRole = message.guild.roles.highest;
       if(modRoles) modRole = message.guild.roles.cache.get(modRoles.Role);
        
    
        if(!message.member.permissions.has("KICK_MEMBERS")&&!message.member.roles.cache.has(modRole.id)) return message.channel.send(`You need the kick members permission in order to execute this command!`)
        if(!message.guild.me.permissions.has(['KICK_MEMBERS'])) return message.channel.send(`I need the kick members permission in order to kick members.`)
        if(!args[0]) return message.channel.send(`Please specify a member.`)
        const member = await bot.util.getUserFromMention(args[0], message.guild.members) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0]);
        if(typeof member === "undefined") return message.channel.send(`Invalid Command Usage. Please specify a valid member`)
        if(member){
            if(member.roles.highest.position > message.member.roles.highest.position && message.member.id !== message.guild.ownerID) return message.channel.send(`I cannot kick someone higher than you!`)
            if(!member.kickable) return message.channel.send(`Failed to kick \`${member.user.tag}\` as they arent kickable`);
            let reason = args.slice(1).join(" ");
            if(!args[1]) reason = "No reason Specified";
            let caseId = Math.floor(Math.random() * (parseInt(message.guild.id) / 10)-10);
           const embed = new MessageEmbed()
                .setDescription(stripIndents`
                    ${bot.emojis.cache.find(e => e.name === "success").toString()} Succesfully kicked **${member.user.tag}** with case id: \`${caseId}\`
                `)
                .setColor("GREEN")
            await message.channel.send(embed)
            const __ = new MessageEmbed()
                .setTitle(`You have been kicked`)
                .setDescription(`Your punishment in ${message.guild.name} has been updated. **Kicked** by ${message.author.tag}`)
                .addField(`Reason`, reason, false)
                .addField(`Moderator`, `${message.author.tag} (${message.author.id})`, false)
                .addField(`Punishment ID`, caseId, false)
                .setFooter(`Appeal by doing ${prefix}appeal ${caseId}`)
            if(!member.user.bot) await member.send(__).catch(console.error)
            let Case = new GuildCase({
                Guild: message.guild.id,
                CaseID: caseId,
                Punishment: "Kick",
                Reason: reason,
                User: {
                    id: member.user.id,
                    tag: member.user.tag,
                    username: member.user.username,
                    avatarURL: member.user.displayAvatarURL({ dynamic: true})
                },
                Moderator: {
                    id: message.author.id,
                    tag: message.author.tag,
                    username: message.author.username,
                    avatarURL: message.author.displayAvatarURL({ dynamic: true})
                },
                Date: Date.now(),
                Appealed: false,
                UserID: member.user.id
            })
            await member.kick(reason)
            Case.save().then(m => console.log(m)).catch(console.log);

        }
    }
}