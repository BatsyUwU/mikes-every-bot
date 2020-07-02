const { MessageEmbed } = require("discord.js");
const Util = require("../../utils/Util");
const { stripIndents } = require("common-tags")
const modRoleSchema = require("../../database/models/ModRole");
const ms = require("ms");
module.exports = {
    name: "userinfo",
    aliases: ['whois'],
    description: "Get information on a user!",
    usage: `[p]whois | [p]whois @mention | id | displayName | tag | username`,
    category: "info",
    timeout: 10000,
    run: async(bot, message, args) =>{
        const prefix = bot.guildPrefixes.get(message.guild.id)
        let member = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.displayName.startsWith(args.join(" "))) || message.guild.members.cache.find(m => m.user.tag === args.join(" ")) || message.guild.members.cache.find(m => m.user.username.startsWith(args.join(" "))) || message.mentions.members.last();
        if(!args[0]) member = message.member;
        if(member==null || typeof member === "undefined") member = message.member;
        const statuses = {
            "dnd": "Do Not Disturb",
            "online": "Online",
            "offline": "Offline",
            "idle": "Idle"
        }
        console.log(this.name + " was used");
        let s = []
       
        const modRoles = await modRoleSchema.findOne({ Guild: message.guild.id}) || message.guild.roles.highest;
        const modRole = message.guild.roles.cache.get(modRoles.Role || message.guild.roles.highest.id);
        const roles = member.roles.cache.filter(r => r.id !== message.guild.id).sort((a, b) => b.position - a.position).map(r => r.toString())
       const embed = new MessageEmbed()
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true}))
            .addField("User Info", stripIndents`
                Tag: \`${member.user.tag}\`
                ID: \`${member.user.id}\`
                Bot?: \`${member.user.bot == true ? "Yes" : "No"}\`
                Avatar: [jpeg](${member.user.displayAvatarURL({ format: "jpeg"})}) | [png](${member.user.displayAvatarURL({ format: "png"})}) | [gif](${member.user.displayAvatarURL({ dynamic: true})}) | [webp](${member.user.displayAvatarURL({ format: "webp"})})
                Registered At: \`${new Date(member.user.createdAt).toLocaleString("en-US")}\`
                Status: \`${statuses[member.user.presence.status]}\`
                Device: \`${member.user.presence.clientStatus ? member.user.presence.clientStatus.mobile !== null ? "Mobile" : member.user.presence.clientStatus.web !== null ? "Web" : member.user.presence.clientStatus.desktop !== null ? "Desktop" : "Currently Unfound": "Currently Unfound"}\`
                Activites: \`${member.user.presence.activities.map(a => `Type: ${a.type.toLowerCase().replace(/_/g, " ")}, Name: ${a.name}`).join("\n")}\`
                \u200B

            `)
            .addField(`Member Info`, stripIndents`
                Nickname: \`${member.displayName}\`
                Joined At: \`${new Date(member.joinedAt).toLocaleDateString("en-US")}\`
                Joined Since : \`${new Date(member.joinedTimestamp).toLocaleTimeString("en-US")}\`
                 `)
            .addField(`Permissions`, ` ${member.permissions.toArray().map(a => a.toLowerCase()).join(", ").replace(/_/g, " ")}`)
            .addField(`Roles [${roles.length}]`, `${roles.length < 10 ? roles.join(", ") : roles.length > 10 ? await bot.util.trimFromArray(roles, ) : "None"}`)
            .addField(`Acknowledged As`, `${member.id === message.guild.ownerID ? "Server Owner" : member.permissions.has("ADMINISTRATOR") ? "Server Admin" : member.permissions.has(['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_GUILD']) ? "Server Moderator" : "Regular Member"}`)
            .setColor(member.displayHexColor)

            .setThumbnail(member.user.displayAvatarURL({ dynamic: true}))

            message.channel.send(embed)
    }
}