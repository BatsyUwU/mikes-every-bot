const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { stripIndents } = require('common-tags');
module.exports = async(bot, channel) =>{
    if(channel.type === 'dm') return;
   let guild = channel.guild;
    var logsChannels = await db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    else{
        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        
        const embed = new MessageEmbed()
          .setAuthor(`A ${channel.type} channel has been created`)
          .setDescription(stripIndents`
            Name: \`${channel.name}\`
            ID: \`${channel.id}\`
            Category: \`${channel.parent.name}\` (${channel.parentID})
            [Jump](https://discord.com/channels/${guild.id}/${channel.id})
          `)   
          .setColor('RANDOM')
          .setFooter(`Channel ID: ${channel.id}`)
          .setTimestamp()

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

            


    }
}