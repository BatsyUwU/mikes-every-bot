const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
module.exports = async(bot, guild, user) =>{
   
    var logsChannels = await db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    else{
        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        var banInfo = await guild.fetchBan(user);
        const embed = new MessageEmbed()
           .setAuthor(`${user.tag} has been banned.`, )
           .setDescription(`Reason: ${banInfo.reason ? banInfo.reason : "No Reason Provided"}`)
           .setFooter(`User ID: ${user.id}`)
           .setColor("GREEN")
           .setThumbnail(user.displayAvatarURL({ dynamic: true}));
        

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

            


    }
}