const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { stripIndents } = require('common-tags');
module.exports = async(bot, oldGuild, guild) =>{
   
    var logsChannels = await db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    if(typeof logsChannel === 'undefined') return;
    else{
        //.setAuthor(`A role has been created`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
            
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        
        if(guild.name !== oldGuild.name){

        const embed = new MessageEmbed()
            .setAuthor(`The servers name has changed`, oldGuild.iconURL({ dynamic: true, format: 'png'}))
            .setThumbnail(guild.iconURL({ dynamic: true, format: 'png'}))
            .setDescription(`${oldGuild.name} ~~> ${guild.name}`)
            .setTimestamp()
            .setColor('GREEN')
    

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

    } else if(guild.iconURL({ dynamic: true, format: 'png'}) !== oldGuild.iconURL({ dynamic: true, format: 'png'})){

        const embed = new MessageEmbed()
            .setAuthor(`The servers icon has changed`, oldGuild.iconURL({ dynamic: true, format: 'png'}))
            .setThumbnail(guild.iconURL({ dynamic: true, format: 'png'}))
            .setDescription(`[old icon](${oldGuild.iconURL({ dynamic: true, format: 'png'})}) ~~> [new icon](${guild.iconURL({ dynamic: true, format: 'png'})})`)
            .setTimestamp()
            .setColor('GREEN')
    

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

    }


    }
}