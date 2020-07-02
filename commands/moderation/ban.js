const {MessageEmbed} = require('discord.js')
var db = require(`quick.db`)
const modRoleSchema = require('../../database/models/ModRole')
const { stripIndents } = require('common-tags')
const GuildCase = require('../../database/models/GuildCase.js')
module.exports={
    name: "ban",
    aliases: ['b'],
    description: "ban a mentioned user or their id",
    category: "moderation",
    usage: `ban [user id/mention/tag] [reason] | ban --hack [user id]`,
    run: async(bot,message,args)=>{
      if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(`You need the ban members permission in order to execute this command.`)
      if(!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send("I need the ban members permission in order to execute this command!")
      
       if(!args[0])return message.channel.send(`Invalid Command Usage: Try\n[p]ban <User ID, mention> (reason)`) 
       if(args[0].toLowerCase()==="--hack"){
           message.guild.members.ban(args[1], { reason: args.slice(2).join(" ")}).then(user =>{
               message.channel.send(`Succesfully banned ${user.id || user.username || user.tag || user}`);
               
           });
           return;
       }else{
        const prefix = bot.guildPrefixes.get(message.guild.id);
        let modRoles = await modRoleSchema.findOne({ Guild: message.guild.id});
        let modRole;
        if(!modRoles) modRole = message.guild.roles.highest;
        if(modRoles) modRole = message.guild.roles.cache.get(modRoles.Role);
         
     
         if(!message.member.permissions.has("BAN_MEMBERS")&&!message.member.roles.cache.has(modRole.id)) return message.channel.send(`You need the ban members permission in order to execute this command!`)
 
         if(!args[0]) return message.channel.send(`Please specify a member.`)
         const member = await bot.util.getUserFromMention(args[0], message.guild.members) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0]);
         if(typeof member === "undefined") return message.channel.send(`Invalid Command Usage. Please specify a valid member`)
         if(member){
             if(member.roles.highest.position > message.member.roles.highest.position && message.member.id !== message.guild.ownerID) return message.channel.send(`I cannot ban someone higher than you!`)
             if(!member.bannable) return message.channel.send(`Failed to ban \`${member.user.tag}\` as they arent banable`);
             let reason = args.slice(1).join(" ");
             if(!args[1]) reason = "No reason Specified";
             let caseId = Math.floor(Math.random() * (parseInt(message.guild.id) / 10)-10);
            const embed = new MessageEmbed()
                 .setDescription(stripIndents`
                     ${bot.emojis.cache.find(e => e.name === "success").toString()} Succesfully banned **${member.user.tag}** with case id: \`${caseId}\`
                 `)
                 .setColor("GREEN")
             await message.channel.send(embed)
             const __ = new MessageEmbed()
                 .setTitle(`You have been banned`)
                 .setDescription(`Your punishment in ${message.guild.name} has been updated. **Banned** by ${message.author.tag}`)
                 .addField(`Reason`, reason, false)
                 .addField(`Moderator`, `${message.author.tag} (${message.author.id})`, false)
                 .addField(`Punishment ID`, caseId, false)
                 .setFooter(`Appeal by doing ${prefix}appeal ${caseId}`)
             if(!member.user.bot) await member.send(__).catch(console.error)
             let Case = new GuildCase({
                 Guild: message.guild.id,
                 CaseID: caseId,
                 Punishment: "Ban",
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
             message.guild.members.ban(member.id, { reason: reason});
             Case.save().then(m => console.log(m)).catch(console.log);
 
         }
       }
       
       
       //You can customize this as much as you'd like
}}