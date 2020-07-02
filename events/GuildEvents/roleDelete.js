const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { stripIndents } = require('common-tags');
module.exports = async(bot, role) =>{
   let guild = role.guild;
    var logsChannels = await db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    else{
        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        //
        const embed = new MessageEmbed()
          .setAuthor(`A role has been deleted`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
        .setColor("RED")
        .setDescription(stripIndents`
            **Role Name:** \`${role.name}\`
            **Role Color:** \`${role.hexColor}\`
            **Role ID:** \`${role.id}\`
           
            **Integration?:** \`${role.managed == true ? "Yes" : "No"}\`
            **Hoisted?:** \`${role.hoist == true ? "Yes" : "No"}\`
            **Mentionable?:** \`${role.mentionable == true ? "Yes" : "No"}\`
            **Members:** ${role.members.size > 0 ? role.members.map(m => m.toString()) : "None"}\n\n
            **Permissions:** ${role.permissions.toArray().map(p => `**${p.toLowerCase()}**`).join(", ").replace(/_/g, " ")}
         `)
         .setFooter(`Role ID: ${role.id}`)
         .setTimestamp();        

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

            


    }
}